import main from '../component/main'
import React from 'react'
import { Button, List, Icon, Input, Grid, Header, Divider, Container } from 'semantic-ui-react'
import { userDescription, calcProgress } from '../user-description'
import store from '../store'

const lockedFields = { gmail: true, email: true }
const note = text =>
  <i style={{
    color: 'grey',
    fontWeight: 'normal',
    letterSpacing: '0.03em',
  }}>{text}</i>

const catDivider = (key, props) =>
  <List.Item key={key} style={{ border: 0 }}>
    <Divider horizontal style={{ padding: '0 10%', marginTop: '3em' }}>{props.title}</Divider>
    <Container text textAlign='center'>{note(props.text)}</Container>
  </List.Item>

const bigStyle = { padding: 0, width: '100%', verticalAlign: 'middle' }
const wrapBigItem = (key, props, content) =>
  <List.Item key={key}>
    <List.Icon name={props.icon} size='huge' />
    <List.Content style={bigStyle}>
      <List.Header>{props.title}</List.Header>
      {content}
    </List.Content>
  </List.Item>

const wrapSmallItem = (key, props, content) =>
  <List.Item as={Grid} key={key}>
      <Grid.Column width='2' textAlign='center'>
        <List.Icon name={props.icon} />
      </Grid.Column>
      <Grid.Column width='13' style={{ padding: '0.3em 0' }}>
      <List.Header>{props.title}</List.Header>
        {content === LOADING ? '...' : note(content)}
      </Grid.Column>
      <Grid.Column
        width='1'
        textAlign='right'
        style={{ cursor: lockedFields[key] ? '' : 'pointer' }}
        onClick={ev => lockedFields[key] || store.action.userSet(key, null)}>
        <List.Icon style={{
          paddingRight: '1em',
          color: lockedFields[key] ? 'grey' : 'black',
        }} name='remove' loading={content === LOADING} />
      </Grid.Column>
  </List.Item>

const actionBtn = word => (key, props) =>
  <List.Description as={Grid}>
    <Grid.Column width="13">{props.text}</Grid.Column>
    <Grid.Column width="3">
      <Button fluid
        onClick={() => lockedFields[key] || store.action.userSet(key, word)}>{word}</Button>
    </Grid.Column>
  </List.Description>

const fullItem = {
  account: (key, props) =>
    <List.Description as={Grid}>
      <Grid.Column width='13'>{props.text}</Grid.Column>
      <Grid.Column width='3'><Button
        onClick={store.action.connect[key]}
        fluid>Connect</Button></Grid.Column>
    </List.Description>,
  ask: (key, props) =>
    <Input fluid
      id={`input-${key}`}
      style={{ marginTop: 4 }}
      action={{
        onClick: () => store.action
          .userSet(key, document.getElementById(`input-${key}`).value),
        labelPosition: 'right',
        icon: 'save',
        content: 'Répondre',
      }}
    />,
  install: actionBtn('Fait'),
  invite: actionBtn('Reçue'),
  hand: actionBtn('Présenté'),
  sign: actionBtn('Signé'),
}

const { LOADING } = store.action.status
const smallItem = value => value === true
  ? <Icon name='checkmark' />
  : value

const listItem = ([ key, props ], state) => props.type === 'divider'
  ? catDivider(key, props)
  : state.user && state.user[key]
  ? wrapSmallItem(key, props, smallItem(state.user[key]))
  : wrapBigItem(key, props, fullItem[props.type](key, props))

const userEntries = Object.entries(userDescription)
  .filter(([,{type}]) => type !== 'internal')

const css = `
.circle-progress {
  stroke: #2185D0;
  fill: none;
  stroke-width: 20;
  transform-origin: center;
  transform: rotate(90deg);
  animation: progress 2s cubic-bezier(0, 1.1, 1, 1) forwards;
}
@keyframes progress {
  0% {
    stroke-dasharray: 0 722;
    transform: rotate(120deg);
  }
}
.ui.relaxed.list:not(.horizontal)>.item:not(:last-child) {
  padding-bottom: 1.5em;
}
.ui.relaxed.list:not(.horizontal)>.item:not(:first-child) {
  padding-top: 1.5em;
}`

const fallbackUrl = 'https://images-na.ssl-images-amazon.com/images/I/61nVe1UpNTL._SX522_.jpg'
const view = state => {
  const progress = calcProgress(state.user)
  return (
    <List divided relaxed>
      <style>{css}</style>
      <Header icon
        as='h2'
        textAlign='center'
        style={{ marginTop: '5em' }}
      >
      <svg viewBox="0 0 500 250" width="250">
        <defs>
          <clipPath id="circleView">
            <circle cx="250" cy="125" r="105" fill="#FFFFFF" />
          </clipPath>
        </defs>
        <path
          className="circle-progress"
          strokeDasharray={`${progress*722}, 722`}
          d="M135,125a115,115 0 1,0 230,0a115,115 0 1,0 -230,0" />
        <path
          className="circle-progress-contour"
          stroke='#OOO'
          opacity='0.2'
          strokeWidth='0.2'
          d="M135,125a115,115 0 1,0 230,0a115,115 0 1,0 -230,0" />
        <image
          width="500"
          height="250"
          xlinkHref={state.user.photo || fallbackUrl}
          clipPath="url(#circleView)" />
      </svg>
        <Header.Content>
          {state.user.firstname || state.user.name || state.user.gmail}
          {progress < 1 ? ` ${Math.floor(progress*100)}%` : ''}
        </Header.Content>
      </Header>
      <Container>
        <Button basic icon
          onClick={store.action.signOut}
          floated='right'
          labelPosition='right'>
          Déconnexion
          <Icon name='sign out' />
        </Button>
      </Container>
      {userEntries.map(entry => listItem(entry, state))}
    </List>
  )
}

export default () => main(view)
