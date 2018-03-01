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

const ghEvents = {
  create: () => { /**/ }
}

exports.githubWebhook = functions.https.onRequest((req, res) => {
  console.log(req.url, req.body, req.param, req.params)
  return res.end()
    // return res.status(500).send('Something went wrong while posting the message to Slack.');
})
