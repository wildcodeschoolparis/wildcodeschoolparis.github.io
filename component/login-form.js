import React from 'react'
import { Button, Form, Header, Icon, Message, Segment } from 'semantic-ui-react'

export default () => <div style={{ marginTop: '10vh' }}>
  <Header as='h2' textAlign='center'>
    <Icon name='github' />
    Connecte ton compte Github
  </Header>
  <Button fluid size='large'>Se connecter</Button>
  <Message>
    Pas de compte github ?
    <a href='https://github.com/join?source=header-home'>Sign Up</a>
  </Message>
</div>
