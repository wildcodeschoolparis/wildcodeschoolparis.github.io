import React from 'react'
import { Card, Image, Header, Icon, Progress, Button } from 'semantic-ui-react'
import { completedCount, totalSteps } from '../user-description'
import store from '../store'
import Link from 'next/link'

const card = (wilder, state, progress) =>
  <Link href={`http://localhost:5000/profile?wilder=${wilder.id}`}>
    <Card key={wilder.id}>
      <Card.Content>
        <Image floated='right' size='mini' src={wilder.photo || state.fallbackUrl} />
        <Card.Header>
          {wilder.firstname || wilder.name || wilder.gmail || wilder.email}
        </Card.Header>
        <Card.Meta style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {wilder.gmail || wilder.email}
        </Card.Meta>
        <Card.Description>
          {wilder.wildside || 'Pas encore de coté wild'}
          <Progress
            style={{ margin: 0 }}
            progress={progress > 2 ? 'ratio' : '' }
            color={progress === totalSteps ? null : 'blue'}
            value={progress}
            total={totalSteps}
            size='small' />
        </Card.Description>
      </Card.Content>
    </Card>
  </Link>


export default state =>
  <div>
    <Header key='header' as='h2' textAlign='center'>
      Onboarding Status
    </Header>
    <Card.Group>
      {Object.values(state.promo || {})
        .map(wilder => card(wilder, state, completedCount(wilder)))}
    </Card.Group>
  </div>
