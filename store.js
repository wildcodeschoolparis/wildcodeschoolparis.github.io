import loader from './state/loader'
import config from './config'
import Router from 'next/router'

Router.onRouteChangeStart = url => S.loading = true
Router.onRouteChangeComplete = url => (S.route = url, S.loading = false)

const noOp = _ => _

typeof __NEXT_DATA__ !== 'undefined' && setTimeout(() => {
  // trigger re-render with __NEXT_DATA__, a bit hacky, sorry mom
  S.route = __NEXT_DATA__.pathname
  S.query = __NEXT_DATA__.query
  S.props = __NEXT_DATA__.props
})

const forever = new Promise((s) =>s())
const LOADING = {}

let _onUpdate = () => {}
let _currentState = {
  loading: true,
  promoInfo: {},
}


const last = _ => _[_.length - 1]
const pxy = (propagate, base = {}, store = {}) => {
  const set = (src, key, value) => {
    // console.log(last(Error("").stack.split('\n')), key, value)
    if (typeof key !== 'string' || store[key] === value) return true
    propagate(store = { ...(store || {}), [key]: value })
    return true
  }
  return new Proxy(base, {
    set,
    get: (src, key) => key in src
      ? src[key]
      : (src[key] = pxy(value => set(0, key, value), base[key], store[key])),
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

const initDb = async currentUser => {
  if (!currentUser) throw Error('Failed to sign in firebase user')
  console.log('firebase user retrived')
  const db = S.db = await firebase.database()
  db.user = currentUser
  console.log('firebase database retrived')
  const toVal = s => s.val()
  db.get = ref => db.ref(ref).once('value').then(toVal)

  const linkCache = Object.create(null)
  db.link = (ref, { map = noOp, to = ref } = {}) => linkCache[to]
    || (linkCache[to] = new Promise((s, f) => {
      const [ key, ...path ] = to.split('/').reverse()
      const storeRef = path.reduceRight((src, key) => src[key], S)
      typeof ref === 'string' && (ref = db.ref(ref))
      ref.on('value', data => s(storeRef[key] = map(data.val())), f)
    }))

  S.firebase = firebase

  typeof window === 'undefined' || (window.db = db, window.S = S.getState)
  const user = await db.link(`user/${db.user.uid}`, { to: 'user' })

  user && (S.user = user)
  if (!user || !user.promo) return db

  const userRef = db.ref('user')
  Promise.all([
    db.link(userRef.orderByChild('promo').equalTo(user.promo), { to: 'promo' }),
    db.link(userRef.orderByChild('role').equalTo('team'), { to: 'team' }),
    db.link(`promo/${user.promo}`, { to: 'promoInfo' }),
  ]).catch(console.error)

  return db
}

const getLogin = async token => token && (await (await fetch('https://api.github.com/user', {
  headers: { Authorization: `token ${token}` }
})).json()).login

const getGithubLogin = async (db, uid) => getLogin(await db.get(`private/${uid}/githubToken`))

const S = pxy(store => _onUpdate(_currentState = store), {
  action: {
    status: { LOADING },
    connect: {
      github: async () => {
        const firebase = await firebaseInitialized
        const auth = firebase.auth()
        const { currentUser } = auth
        const { uid } = currentUser
        const provider = new firebase.auth.GithubAuthProvider()
        provider.addScope('user')
        const { db } = _currentState
        const { credential, user } = await auth.signInWithPopup(provider)
          .catch(noOp)

        console.log('github', { credential, user })
        await Promise.all([
          db.ref(`user/${uid}/github`)
            .set(await getLogin(credential.accessToken)),
          db.ref(`private/${currentUser.uid}/githubToken`)
            .set(credential.accessToken),
          user && (user.uid !== currentUser.uid) && user.delete(),
        ])

        S.githubToken = credential.accessToken

        await currentUser.linkWithCredential(credential)
        await auth.signInWithCredential(credential)
      },
    },
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
        .catch(noOp)

      const db = await initDb(user)
      S.loading = false
      return db.ref(`private/${user.uid}/googleToken`)
        .set(credential.accessToken)
    },
    userSet: async (key, value) => {
      const { db, user } = _currentState
      if (!user || user[key] === LOADING) return
      S.user[key] = LOADING
      await db.ref(`user/${user.id}/${key}`).set(value)
    },
  },
  getState: () => _currentState,
  onUpdate: fn => (_onUpdate = fn, () => _onUpdate = () => {}),
}, _currentState)

//// DEBUG

export default S
