import { Grid, Segment, Container, List, Image, Icon } from 'semantic-ui-react'

export default () => {
  return (
    <Segment
      inverted
      vertical
      style={{ margin: '5em 0em 0em', padding: '5em 0em' }}
    >
      <Container textAlign='center'>
        <Image
          centered
          size='mini'
          src='//wildcodeschool.fr/wp-content/uploads/2017/01/logo_orange_pastille.png'
        />
        <List horizontal inverted divided link>
          <List.Item as='a' href='https://github.com/wildcodeschoolparis/wildcodeschoolparis.github.io'>
            <Icon name='github'/>
            {'Open Source'}</List.Item>
          <List.Item as='a' href='https://wildcodeschool.fr/'>wildcodeschool.fr</List.Item>
          <List.Item as='a' href='https://wildcodeschool.fr/nous-soutenir/'>Nous soutenir</List.Item>
        </List>
      </Container>
    </Segment>
  )
}
