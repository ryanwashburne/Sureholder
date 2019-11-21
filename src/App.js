import React from 'react'
import { IdentityContextProvider } from 'react-netlify-identity-widget'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import {
  HomePage,
  DashboardPage,
  SettingsPage,
} from './pages'


const ErrorPage = () => {
  return (
    <>
      <h1>Error</h1>
      <p>Page not found</p>
    </>
  )
}

const DashboardRouter = ({ match }) => {
  return (
    <Switch>
      <Route exact path={match.path} component={DashboardPage} />
      <Route exact path={`${match.path}/settings`} component={SettingsPage} />
    </Switch>
  )
}

export default () => {
  return (
    <IdentityContextProvider url={`https://washburneposse.netlify.com/`}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/dashboard" component={DashboardRouter} />
          <Route component={ErrorPage} />
        </Switch>
      </Router>
    </IdentityContextProvider>
  )
}