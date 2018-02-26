import loader from './loader'
import config from '../config'

// gapi doc https://developers.google.com/api-client-library/javascript/reference/referencedocs
// gapi.auth2.getAuthInstance().signIn()
// gapi.auth2.getAuthInstance().signOut()

export default (async () => { try {
  if (typeof window === 'undefined') return {} // skip load in node
  const gapi = await loader.gapi

  await new Promise((s,f) =>
    gapi.load('client:auth2', { callback: s, onerror: f }))

  await gapi.client.init({
    discoveryDocs: config.google.discoveryDocs,
    clientId: config.google.clientId,
    scope: config.google.scope.join(' '),
  })

  // Handle the initial sign-in state.
  const gapiAuth = gapi.auth2.getAuthInstance()
  if (!gapiAuth.isSignedIn.get()) {
    await new Promise(s =>
      gapi.auth2.getAuthInstance().isSignedIn.listen(signed => signed && s()))
  }
  const firebase = await loader.firebase
  firebase.initializeApp({
    apiKey: 'AIzaSyB7L_HNksUk4M1OTe0FycuxvF_4Zq74VEE',
    authDomain: 'wildcodeschoolparis.firebaseapp.com',
    databaseURL: 'https://wildcodeschoolparis.firebaseio.com',
    projectId: 'wildcodeschoolparis',
    storageBucket: 'wildcodeschoolparis.appspot.com',
    messagingSenderId: '115429394411',
  })
  const idToken = gapiAuth.currentUser.get().getAuthResponse().id_token
  const creds = firebase.auth.GoogleAuthProvider.credential(idToken)
  const user = await firebase.auth().signInWithCredential(creds)
  const db = await firebase.database()
  db.get = ref => new Promise((s, f) => db.ref(ref).on('value', function off(_) {
    s(_.exportVal())
    db.ref(ref).off('value', off)
  }))
  return Object.assign(gapi.client, { firebase, gapi, db, user })
} catch (err) {
  // we skip the "already exists" message which is
  // not an actual error when we're hot-reloading
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
  return {}
} })()
