import React from 'react'
import { IdentityContextProvider } from 'react-netlify-identity-widget'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import {
  HomePage,
  DashboardPage,
  SettingsPage,
} from './pages'

import Auth from './utils/auth'

const ErrorPage = () => {
  return (
    <>
      <h1>Error</h1>
      <p>Page not found</p>
    </>
  )
}

const PrivateRoute = (props) => {
  return (
    <Auth>
      <Route {...props} />
    </Auth>
  )
}

export default () => {
  return (
    <IdentityContextProvider url={`https://sureholder.netlify.com`}>
      <Router>
        <Switch>
          <PrivateRoute exact path={`/`} component={DashboardPage} />
          <PrivateRoute exact path={`/settings`} component={SettingsPage} />
          <Route exact path={`/auth`} component={HomePage} />
          <Route component={ErrorPage} />
        </Switch>
      </Router>
    </IdentityContextProvider>
  )
}