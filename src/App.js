import React from 'react'
import { IdentityContextProvider } from 'react-netlify-identity-widget'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import client from './apollo'
import { ApolloProvider } from '@apollo/react-hooks'

import {
  AuthPage,
  DashboardPage,
  SettingsPage,
  AdminPage,
  StockPage,
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

const PrivateRoute = ({ admin, ...props }) => {
  return (
    <Auth admin={admin}>
      <Route {...props} />
    </Auth>
  )
}

export default () => {
  return (
    <IdentityContextProvider url={`https://sureholder.netlify.com`}>
      <ApolloProvider client={client}>
        <Router>
          <Switch>
            <PrivateRoute exact path={`/`} component={DashboardPage} />
            <PrivateRoute exact path={`/stock`} component={StockPage} />
            <PrivateRoute exact path={`/settings`} component={SettingsPage} />
            <PrivateRoute admin exact path={`/admin`} component={AdminPage} />
            <Route exact path={`/auth`} component={AuthPage} />
            <Route component={ErrorPage} />
          </Switch>
        </Router>
      </ApolloProvider>
    </IdentityContextProvider>
  )
}