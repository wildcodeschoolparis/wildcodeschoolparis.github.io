import main from '../component/main'
import loginForm from '../component/login-form'
import init from '../state/services'

init.then(({ drive }) => {
  drive.files.list({
    maxResults: 2,
    q: 'trashed=false and sharedWithMe',
  }).then(console.log, console.error)
})

export default () => main([ loginForm() ])
