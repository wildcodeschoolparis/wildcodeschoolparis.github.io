import React from 'react'
import { List } from 'semantic-ui-react'
import store from '../store'
import checklist from '../checklist'

const list = Object.entries(checklist).map(([ key, props ]) => ({
  check: () => store.action.check(key),
  key,
  ...props,
}))

const item = ({ key, link, message, check }, state) => {
  const color = state.checklist[key] === 'loading' ? 'grey' : 'black'
  const icon = state.checklist[key] === 'loading'
    ? 'selected radio'
    : state.checklist[key]
    ? 'check circle'
    : 'circle'

  return (
    <List.Item key={key}>
      <List.Icon
        style={{ cursor: 'pointer' }}
        onClick={check}
        name={icon}
        size='large'
        color={color}
        verticalAlign='middle' />
      <List.Content>
        <List.Header>{message}</List.Header>
        <List.Description><a href={link}>{link}</a></List.Description>
      </List.Content>
    </List.Item>
  )
}

export default state =>
  <List key='checklist' divided relaxed style={{ textAlign: 'left' }}>
    {list.map(props => item(props, state))}
  </List>
