const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

const db = admin.database()
const userRef = db.ref('user')
const githubRef = db.ref('github')

///////// Inir user data on creation (set secure role)
exports.initUserData = functions.auth.user()
  .onCreate(({ data: { email, displayName, uid, photoURL } }) => {

    const user = {
      id: uid,
      name: displayName,
      gmail: email,
      photo: photoURL,
    }

    const isTeam = email.endsWith('@wildcodeschool.fr')
    isTeam && (user.role = 'team')
    isTeam && (user.email = email)
    return userRef.update({ [uid]: user })
  })


////// Keep a list of all files
const isMarkdown = f => f.endsWith('.md')
const addPath = (src, p) => (src[Buffer(p).toString('base64')] = p, src)
const delPath = (src, p) => (src[Buffer(p).toString('base64')] = null, src)
const computeChanges = (src, c) =>
  c.removed.filter(isMarkdown).reduce(delPath,
    c.added.filter(isMarkdown).reduce(addPath, src))

exports.githubWebhook = functions.https.onRequest((req, res) => {
  const { commits, ref, repository: { name } } = req.body
  if (ref !== 'refs/heads/master') return res.end('Ignored, not master')
  if (name.endsWith('.github.io')) return res.end('Ignored, main directory')

  return githubRef
    .update({ [repository.name]: commits.reduce(computeChanges, {}) })
    .then(() => res.end(), err => res.status(500).send(err.message))
})
