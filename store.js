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
  try {
    firebase.initializeApp({
      apiKey: 'AIzaSyB7L_HNksUk4M1OTe0FycuxvF_4Zq74VEE',
      authDomain: 'wildcodeschoolparis.firebaseapp.com',
      databaseURL: 'https://wildcodeschoolparis.firebaseio.com',
      projectId: 'wildcodeschoolparis',
      storageBucket: 'wildcodeschoolparis.appspot.com',
      messagingSenderId: '115429394411',
    })
  } catch(err) {
    if (!/already exists/.test(err.message)) { // skip error from hotreload
      console.error('Firebase initialization error', err.stack)
    }
  }

  const user = firebase.auth().currentUser
    || (await new Promise(s => firebase.auth().onAuthStateChanged(s)))

  user && (await initDb(user))

  S.loading = false
  return firebase
})()

const initDb = async user => {
  if (!user) throw Error('Failed to sign in firebase user')
  S.user = user
  console.log('firebase user retrived')
  const db = S.db = await firebase.database()
  console.log('firebase database retrived')
  db.get = ref => new Promise((s, f) =>
    db.ref(ref).on('value', function off(_) {
      s(_.exportVal())
      db.ref(ref).off('value', off)
    }))

  const noOp = _ => _
  const linkCache = Object.create(null)
  db.link = (ref, map = noOp, to = ref) => linkCache[to]
    || (linkCache[to] = new Promise(resolve => {
      const [ key, ...path ] = to.split('/').reverse()
      const storeRef = path.reduceRight((src, key) => src[key], S)
      db.ref(ref).on('value', s => resolve(storeRef[key] = map(s.val())))
    }))

  S.firebase = firebase

  const [ token, checklist, isTrainer ] = await Promise.all([
    db.get(`users/${user.uid}/token/github`),
    db.get(`users/${user.uid}/checklist`),
    db.get(`users/${user.uid}/trainer`),
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
    const linkChecklist = ([ id, wilder ]) => new Promise.all([
      db.link(`users/${wilder.id}/checklist`),
      db.link(`validation/${wilder.id}`),
    ])
    db.link('id')
    setInterval(() => console.log(_currentState), 10000)
    await new Promise((s, f) => db.ref(`201802`).on('value', s => {
      const wilders = s.val()
      Promise.all(Object.entries(wilders)
        .map(encodeEmails)
        .filter(hasId)
        .map(linkChecklist)).then(s, f)
      S.promo = wilders
    }))
  }
  return db
}

const S = pxy(store => _onUpdate(_currentState = store), {
  action: {
    signOut: async () => {
      const firebase = await firebaseInitialized
      await firebase.auth().signOut()
      console.log('firebase signout')
      S.user = undefined
    },
    signIn: async () => {
      const firebase = await firebaseInitialized
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      const { user, credential } = await firebase.auth()
        .signInWithPopup(provider)
        .catch(_ => _)

      return (await initDb(user))
        .ref(`users/${user.uid}/token/google`).set(credential.accessToken)
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
