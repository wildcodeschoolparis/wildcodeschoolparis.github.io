import React from 'react'
import Head from 'next/head'
import { Grid, Dimmer, Loader, Container, Segment } from 'semantic-ui-react'
import Menu from './menu'
import Footer from './footer'
import loader from '../state/loader'
import config from '../config'
import store from '../store'

const toGrid = (el, key) =>
  <div key={key}>
    {el(store.getState())}
  </div>

class Main extends React.Component {
  constructor() {
    super()
    this.state = store.getState()
    store.onUpdate(state => this.setState(state))
  }
  render() {
    console.log('rendering', this.state)
    return <React.Fragment>
      {Menu(this.state)}
      <Dimmer.Dimmable style={{marginTop: '7em'}} active={this.state.loading}>
        <Container text style={{ maxWidth: 900 }}>
          <Dimmer inverted active={this.state.loading}>
            <Loader>Chargement</Loader>
          </Dimmer>
          {this.props.column.map(toGrid)}
        </Container>
      </Dimmer.Dimmable>
      {Footer(this.state)}
    </React.Fragment>
  }
}

export default childrens => <React.Fragment>
  <Head>
    <title>Wild Code School Paris</title>
    <meta name="google-signin-cookiepolicy" content="single_host_origin" />
    <meta name="google-signin-client_id" content={config.google.clientId} />
    <meta name="google-signin-scope" content={config.google.scope.join(' ')} />
    { Object.values(loader).map(s => s.script) }
    <link
      rel="stylesheet"
      href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
      ></link>
  </Head>
  <Main column={childrens}></Main>
</React.Fragment>
