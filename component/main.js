import React from 'react'
import Head from 'next/head'
import { Dimmer, Loader, Container } from 'semantic-ui-react'
import Menu from './menu'
import Footer from './footer'
import loader from '../state/loader'
import config from '../config'
import store from '../store'
import loginForm from './login-form'
import { withRouter } from 'next/router'

class Main extends React.Component {
  constructor() {
    super()
    this.state = store.getState()
    store.onUpdate(state => this.setState(state))
  }
  render() {
    return <React.Fragment>
      {Menu(this.state, this.props)}
      <Dimmer.Dimmable>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Dimmer inverted active={this.state.loading}>
            <Loader>Chargement</Loader>
          </Dimmer>
          {loginForm(this.state, this.props, this.props.view)}
        </div>
      </Dimmer.Dimmable>
      {Footer(this.state)}
    </React.Fragment>
  }
}

const RoutedMain = withRouter(Main)

export default view => <React.Fragment>
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
    <style>{`
      body { height: auto; background; padding-top: 7em }
      html { background: #1b1c1d }
    `}</style>
  </Head>
  <RoutedMain style={{ minHeight: '63vh' }} view={view}></RoutedMain>
</React.Fragment>
