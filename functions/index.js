const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

const db = admin.database()
const userRef = db.ref('user')

exports.initUserData = functions.auth.user()
  .onCreate(({ data: { email, displayName, uid, photoURL } }) => {

  const user = {
    gmail: email,
    name: displayName,
    id: uid,
    photo: photoURL,
  }

  const isTeam = email.endsWith('@wildcodeschool.fr')
  isTeam && (user.role = 'team')
  isTeam && (user.email = email)
  return userRef.update({ [uid]: user })
})
