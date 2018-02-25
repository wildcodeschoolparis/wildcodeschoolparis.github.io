import React from 'react'
import Head from 'next/head'
import { Grid } from 'semantic-ui-react'
import loader from '../state/loader'
import config from '../config'

const toGrid = (el, key) => <Grid.Column key={key} style={{ maxWidth: 450 }}>{
  el
}</Grid.Column>

export default childrens => <React.Fragment>
  <Head>
    <title>Wild Code School Paris</title>
    <meta name="google-signin-client_id" content={config.google.clientId} />
    <meta name="google-signin-cookiepolicy" content="single_host_origin" />
    <meta name="google-signin-scope" content={config.google.scope.join(' ')} />
    { Object.values(loader).map(s => s.script) }
    <link
      rel="stylesheet"
      href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
      ></link>
  </Head>
  <Grid
    textAlign='center'
    style={{ height: '100%' }}
    verticalAlign='middle' >{childrens.map(toGrid)}</Grid>
</React.Fragment>
