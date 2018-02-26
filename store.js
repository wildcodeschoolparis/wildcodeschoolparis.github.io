import loader from './state/loader'
import config from './config'
import Router from 'next/router'

Router.onRouteChangeStart = url => S.loading = true
Router.onRouteChangeComplete = url => (S.route = url, S.loading = false)

const forever = new Promise((s) =>s())

let _onUpdate = () => {}
let _currentState = {
  loading: true,
  checklist: {},
  users: {},
  id: {},
  validation: {},
}

const pxy = (propagate, base = {}, store = {}) => {
  const set = (src, key, value) => {
    if (typeof key !== 'string' || store[key] === value) return true
    propagate(store = { ...(store || {}), [key]: value })
    return true
  }
  return new Proxy(base, {
    set,
    get: (src, key) => {
      if (src[key]) return src[key]
      return src[key] = pxy(value => set(0, key, value), base[key], store[key])
    },
  })
}

const firebaseInitialized = (async () => {
  const firebase = await loader.firebase
  if (typeof window === 'undefined') return {} // skip load in node
  firebase.initializeApp({
    apiKey: 'AIzaSyB7L_HNksUk4M1OTe0FycuxvF_4Zq74VEE',
    authDomain: 'wildcodeschoolparis.firebaseapp.com',
    databaseURL: 'https://wildcodeschoolparis.firebaseio.com',
    projectId: 'wildcodeschoolparis',
    storageBucket: 'wildcodeschoolparis.appspot.com',
    messagingSenderId: '115429394411',
  })

  return firebase
})()

const gapiInitialized = (async () => {
  if (typeof window === 'undefined') return {} // skip load in node
  await forever
  const gapi = await loader.gapi
  console.log('init client')
  await new Promise((s,f) =>
    gapi.load('client:auth2', { callback: s, onerror: f }))
  console.log('init apis')

  await gapi.client.init({
    discoveryDocs: config.google.discoveryDocs,
    clientId: config.google.clientId,
    scope: config.google.scope.join(' '),
  })

  console.log('signed', gapi.auth2.getAuthInstance().isSignedIn.get())
  gapi.auth2.getAuthInstance().isSignedIn.get() && (await finishSignIn(gapi))
  S.loading = false
  return gapi
})()

const finishSignIn = async gapi => {
  const gapiAuth = gapi.auth2.getAuthInstance()
  const currentUser = gapiAuth.currentUser.get()
  const idToken = gapiAuth.currentUser.get().getAuthResponse().id_token
  console.log('finishing sign in')
  const firebase = await firebaseInitialized
  console.log('firebase initialized')
  const creds = firebase.auth.GoogleAuthProvider.credential(idToken)
  const user = S.user = await firebase.auth().signInWithCredential(creds)
  console.log('firebase user signed')
  const db = S.db = await firebase.database()
  console.log('firebase database retrived')
  db.get = ref => new Promise((s, f) =>
    db.ref(ref).on('value', function off(_) {
      s(_.exportVal())
      db.ref(ref).off('value', off)
    }))

  const noOp = _ => _
  const linkCache = Object.create(null)
  db.link = (ref, map = noOp, to = ref) => {
    if (linkCache[to]) return
    linkCache[to] = true
    const [ key, ...path ] = to.split('/').reverse()
    const storeRef = path.reduceRight((src, key) => src[key], S)
    db.ref(ref).on('value', s => storeRef[key] = map(s.val()))
  }

  S.services = {
    gapi,
    firebase,
    drive: gapi.client.drive,
    gmail: gapi.client.gmail,
    calendar: gapi.client.calendar,
  }

  const [ token, checklist, isTrainer ] = await Promise.all([
    db.get(`users/${user.uid}/token/github`),
    db.get(`users/${user.uid}/checklist`),
    db.get(`users/${user.uid}/trainer`),
    db.ref(`users/${user.uid}/token/google`).set(idToken),
    db.ref(`id/${btoa(user.email)}`).set(user.uid),
    db.ref(`users/${user.uid}/profil`).set({
      id: user.uid,
      email: user.email,
      photo: user.photoURL,
    }),
  ])

  token && (S.githubToken = token)
  checklist && (S.checklist = checklist)
  isTrainer && (S.isTrainer = true)
  if (isTrainer) {
    const encodeEmails = ([ id, wilder ]) => {
      const encodedEmail = wilder.encodedEmail = btoa(wilder.email)
      const matchedId = _currentState.id[encodedEmail]
      if (!wilder.id && matchedId) {
        db.ref(`201802/${id}/id`).set(wilder.id = matchedId)
      }
      return [ id, wilder ]
    }
    const hasId = ([ id, wilder ]) => wilder.id
    const linkChecklist = ([ id, wilder ]) => {
      db.link(`users/${wilder.id}/checklist`)
      db.link(`validation/${wilder.id}`)
    }
    db.link('id')
    setInterval(() => console.log(_currentState), 10000)
    db.ref(`201802`).on('value', s => {
      const wilders = s.val()
      Object.entries(wilders)
        .map(encodeEmails)
        .filter(hasId)
        .forEach(linkChecklist)
      S.promo = wilders
    })
  }
}

const S = pxy(store => _onUpdate(_currentState = store), {
  action: {
    signOut: async () => {
      const [ gapi, firebase ] = await Promise.all([
        gapiInitialized,
        firebaseInitialized,
      ])
      await Promise.all([
        gapi.auth2.getAuthInstance().signOut()
          .then(() => console.log('gapi signout')),
        firebase.auth().signOut()
          .then(() => console.log('firebase signout')),
      ])
      S.user = undefined
    },
    signIn: async () => {
      console.log('signin in')
      const gapi = await gapiInitialized
      gapi.auth2.getAuthInstance().signIn()
      await new Promise(s =>
        gapi.auth2.getAuthInstance().isSignedIn.listen(signed => signed && s()))
      console.log('gapi signed')
      return finishSignIn(gapi)
    },
    linkGithub: async () => {
      const firebase = await firebaseInitialized
      const provider = new firebase.auth.GithubAuthProvider()
      provider.addScope('user')
      provider.addScope('repo')
      provider.addScope('write:discussion')
      provider.addScope('admin:org')
      const { credential, user } = await firebase.auth().signInWithPopup(provider)
        .catch(({ credential }) => ({ credential }))
      S.githubToken = credential.accessToken

      const currentUser = firebase.auth().currentUser
      await Promise.all([
        _currentState.db.ref(`users/${currentUser.uid}/token/github`)
          .set(credential.accessToken),
        user && user.delete(),
      ])

      await currentUser.linkWithCredential(credential)
    },
    check: async key => {
      const { db, user, checklist } = _currentState
      if (!db || checklist[value] === 'loading') return
      const value = !checklist[key]
      S.checklist[key] = 'loading'
      await db.ref(`users/${user.uid}/checklist/${key}`).set(value)
      S.checklist[key] = value
    },
  },
  getState: () => _currentState,
  onUpdate: fn => (_onUpdate = fn, () => _onUpdate = () => {}),
}, _currentState)

export default S
