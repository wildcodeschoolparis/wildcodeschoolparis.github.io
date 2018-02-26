import React from 'react'
import { Button, Form, Header, Icon, Message, Segment } from 'semantic-ui-react'
import store from '../store'
import checklist from './onboarding-checklist'

const header = content =>
  <Header key='header' as='h2' textAlign='center'>
    {content}
  </Header>

export default state => {
  const childrens = []
  let message
  if (!state.user) {
    childrens.push(header('Connecte ton compte Google'))
    childrens.push(<Button fluid
      size='large'
      icon='google'
      color='blue'
      style={{ margin: '0 0 1em' }}
      onClick={store.action.signIn}
      content='Se connecter' />)
    childrens.push(<Button fluid disabled
      key='github'
      size='large'
      icon='github'
      color='black'
      content='Lie ton compte Github' />)
  } else {
    const googleBtn = <Button fluid
      size='large'
      icon='google'
      style={{ margin: '0 0 1em' }}
      onClick={store.action.signOut}
      content='Déconnecter' />
    if (state.githubToken) {
      childrens.push(header(`Bienvenu ${state.user.displayName}`))
      childrens.push(googleBtn)
      childrens.push(<Button fluid disabled
        size='large'
        icon='github'
        color='black'
        onClick={store.action.linkGithub}
        content='Compte lié' />)
    } else {
      childrens.push(header('Connecte ton compte Github'))
      childrens.push(googleBtn)
      childrens.push(<Button fluid
        size='large'
        icon='google'
        color='black'
        onClick={store.action.linkGithub}
        content='Lie ton compte Github' />)
    }
  }

  childrens.push(checklist(state))

  return <React.Fragment>{childrens}</React.Fragment>
}
