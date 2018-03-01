import React from 'react'
import { Button, Form, Header, Icon, Message, Container } from 'semantic-ui-react'
import store from '../store'

const header = content =>
  <Header key='header' as='h2' style={{
    margin: '4em 0 2em'
  }}>
    {content}
  </Header>

export default (state, props, view) => !state.user
  ? <Container textAlign='center' style={{minHeight: '30vh'}}>
      {header('Connecte ton compte Google')}
      <Button icon
        labelPosition='left'
        size='large'
        color='blue'
        onClick={store.action.signIn}>
        <Icon name= 'google'/>
        Se connecter
      </Button>
    </Container>
  : view(state, props)
