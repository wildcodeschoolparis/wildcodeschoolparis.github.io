import main from '../component/main'
import { calcProgress } from '../user-description'
import { Icon, Image, Statistic, Container, Grid, Header, Divider } from 'semantic-ui-react'
import Link from 'next/link'

/*
  Profil completion
  Promo (paris fevrier 2018)
  Current Project Team

  Formateur
  Campus Manager


*/

const view = state => {
  const progress = calcProgress(state.user || {})
  const stats = []
  const message = [ `Bienvenue ${state.user.firstname || state.user.name}` ]
  if (progress < 1) {

    stats.push(
      <Link href='/profile' key='profile'>
        <Statistic style={{ cursor: 'pointer' }}>
          <Statistic.Value>
            <Icon name='user circle outline' />
            {Math.floor(calcProgress(state.user) * 100)}%
          </Statistic.Value>
          <Statistic.Label>Profile</Statistic.Label>
        </Statistic>
      </Link>)
    message.push(', merci de compléter ton profil.')
  }

  return (
    <Container textAlign='center'>
      <Container text>
      {message.join('')}
      </Container>
      <Divider horizontal style={{ padding: '4em 0' }}>
        Status
      </Divider>
      <Statistic.Group widths={String(2 + stats.length)} size='small' >
        {stats}
        <Statistic>
          <Statistic.Value>
            <Icon name='student' />
            {Object.values(state.promo || {}).filter(w => !w.role).length}
          </Statistic.Value>
          <Statistic.Label>Wilders</Statistic.Label>
        </Statistic>
        <Statistic>
          <Statistic.Value>
            <Icon name='users' />
            {Object.values(state.promo || {}).filter(w => w.role).length}
          </Statistic.Value>
          <Statistic.Label>Team</Statistic.Label>
        </Statistic>
      </Statistic.Group>
      <Divider horizontal style={{ padding: '4em 0' }}>
        Liens
      </Divider>
      <Grid>
        <Grid.Row columns={3}>
          <Grid.Column as='a' href={`https://chat.wildcodeschool.fr/group/${state.promoInfo.chat || ''}`}>
            <Header as='h2'>
              <svg height="60" viewBox="0 0 256 219"><path d="M255.95 109.307c0-12.853-3.844-25.173-11.43-36.63-6.81-10.283-16.351-19.385-28.355-27.057-23.18-14.806-53.647-22.963-85.782-22.963-10.734 0-21.315.907-31.577 2.705-6.366-5.96-13.82-11.322-21.707-15.56C34.964-10.62.022 9.322.022 9.322s32.487 26.688 27.204 50.08C12.693 73.821 4.814 91.207 4.814 109.307c0 .056.003.115.003.173 0 .057-.003.113-.003.174 0 18.1 7.876 35.486 22.412 49.902C32.509 182.95.022 209.639.022 209.639s34.942 19.939 77.077-.48c7.886-4.238 15.338-9.603 21.707-15.56 10.264 1.796 20.843 2.702 31.577 2.702 32.137 0 62.601-8.151 85.782-22.958 12.004-7.671 21.545-16.77 28.356-27.058 7.585-11.455 11.43-23.781 11.43-36.628 0-.06-.003-.115-.003-.174l.002-.176z" fill="#C1272D"/><path d="M130.383 40.828c59.505 0 107.746 30.814 107.746 68.824 0 38.007-48.241 68.823-107.746 68.823-13.25 0-25.94-1.532-37.662-4.325-11.915 14.332-38.125 34.26-63.587 27.82 8.282-8.895 20.552-23.926 17.926-48.686-15.262-11.873-24.422-27.07-24.422-43.632-.003-38.013 48.238-68.824 107.745-68.824" fill="#FFF"/><path d="M130.383 126.18c7.906 0 14.314-6.408 14.314-14.314 0-7.905-6.408-14.313-14.314-14.313-7.905 0-14.313 6.408-14.313 14.313 0 7.906 6.408 14.314 14.313 14.314zm49.764 0c7.905 0 14.314-6.408 14.314-14.314 0-7.905-6.409-14.313-14.314-14.313s-14.313 6.408-14.313 14.313c0 7.906 6.408 14.314 14.313 14.314zm-99.53-.003c7.904 0 14.311-6.407 14.311-14.31 0-7.904-6.407-14.312-14.31-14.312-7.905 0-14.312 6.408-14.312 14.311 0 7.904 6.407 14.311 14.311 14.311z" fill="#C1272D"/><path d="M130.383 169.42c-13.25 0-25.94-1.33-37.662-3.75-10.52 10.969-32.188 25.714-54.643 25.172-2.959 4.484-6.175 8.15-8.944 11.126 25.462 6.44 51.672-13.486 63.587-27.82 11.723 2.795 24.414 4.325 37.662 4.325 59.027 0 106.962-30.326 107.726-67.915-.764 32.582-48.699 58.861-107.726 58.861z" fill="#CCC"/></svg>
              <div>Chat</div>
            </Header>
          </Grid.Column>
          <Grid.Column as='a' href='http://discourse.innoveduc.fr'>
            <Header as='h2'>
              <svg height='60' viewBox="0 -1 104 106"><path d="M51.87 0C23.71 0 0 22.83 0 51v52.81l51.86-.05c28.16 0 51-23.71 51-51.87S80 0 51.87 0z" fill="#231f20"/><path d="M52.37 19.74a31.62 31.62 0 0 0-27.79 46.67l-5.72 18.4 20.54-4.64a31.61 31.61 0 1 0 13-60.43z" fill="#fff9ae"/><path d="M77.45 32.12a31.6 31.6 0 0 1-38.05 48l-20.54 4.7 20.91-2.47a31.6 31.6 0 0 0 37.68-50.23z" fill="#00aeef"/><path d="M71.63 26.29A31.6 31.6 0 0 1 38.8 78l-19.94 6.82 20.54-4.65a31.6 31.6 0 0 0 32.23-53.88z" fill="#00a94f"/><path d="M26.47 67.11a31.61 31.61 0 0 1 51-35 31.61 31.61 0 0 0-52.89 34.3l-5.72 18.4z" fill="#f15d22"/><path d="M24.58 66.41a31.61 31.61 0 0 1 47.05-40.12 31.61 31.61 0 0 0-49 39.63l-3.76 18.9z" fill="#e31b23"/></svg>
              <div>Forum</div>
            </Header>
          </Grid.Column>
          <Grid.Column as='a' href='https://odyssey.wildcodeschool.fr'>
            <Header as='h2'>
              <Image src='https://wildcodeschool.fr/wp-content/uploads/2017/01/logo_orange_pastille.png' />
              <div>Odyssey</div>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Column as='a' href={state.promoInfo.planing}>
            <Header as='h2' icon>
              <Icon name='calendar' size='huge' />
              <div>Planing</div>
            </Header>
          </Grid.Column>
          <Grid.Column>
          <Grid.Column as='a' href='/refs'>
            <Header as='h2' icon>
              <Icon name='chain' size='huge' />
              Refs
            </Header>
          </Grid.Column>
          </Grid.Column>
          <Grid.Column>
            <Header as='h2' icon>
              <Icon name='question' color='grey' size='huge' />
              Questions
              <Header.Subheader as='i'>
                (pas encore pret)
              </Header.Subheader>
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}


export default () => main(view)
