import React from 'react'
import { Table, Header, Icon } from 'semantic-ui-react'
import store from '../store'
import checklist from '../checklist'

const list = Object.keys(checklist)
const cell = ({ title, subtitle, onClick, icon, align = 'center', style }) =>
  <Table.Cell onClick={onClick} textAlign={align} style={style}>
    <Header as='h4'>
      {icon && <Icon name={icon} />}
      <Header.Content>
          {title}
        <Header.Subheader>{subtitle}</Header.Subheader>
      </Header.Content>
    </Header>
  </Table.Cell>

const monospace = { fontFamily: 'monospace' }
const row = (wilder, state) => {
  const { checklist } = state.users[wilder.id] || {}
  const trainer = state.validation[wilder.id] || ''
  const total = checklist ? Object.values(checklist).filter(Boolean).length : 0
  const percent = total ? Math.round(total/list.length * 100) : 0
  const validate = () => wilder.id && state.db.ref(`/validation/${wilder.id}`)
    .set(state.user.displayName.split(' ')[0])

  return (
    <Table.Row key={wilder.email}>
      {cell({
        title: <Icon name={trainer ? 'checkmark' : 'remove'}></Icon>,
        subtitle: trainer,
        onClick: validate,
      })}
      {cell({
        icon: 'user circle',
        title: `${wilder.firstname} ${wilder.lastname}`,
        subtitle: wilder.email,
        align: 'left',
      })}
      {cell({ title: '', subtitle: wilder.id, style: monospace })}
      {cell({ title: `${percent}%`, subtitle: `${total}/${list.length}` })}
    </Table.Row>
  )
}

export default state =>
  <div style={{ marginTop: '5vh' }}>
    <Header key='header' as='h2' textAlign='center'>
      Onboarding Checklist Status
    </Header>
    <Table celled>
      <style>{`
        td:hover {
          background: #EEE;
          cursor: pointer;
        }
        html, body {
          background: #EEE;
        }
      `}</style>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign='center'>Validated</Table.HeaderCell>
          <Table.HeaderCell>Wilder</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>FirebaseID</Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>Progress</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {Object.values(state.promo || {})
          .map(wilder => row(wilder, state))}
      </Table.Body>
    </Table>
  </div>
