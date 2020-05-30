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

import { AuthRoute, AuthProvider, ColorModeProvider, useColorMode } from './utils'

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
    <AuthRoute admin={admin}>
      <Route {...props} />
    </AuthRoute>
  )
}

const BaseStyles = ({ children }) => {
  const { cm } = useColorMode()
  return (
    <div className={cm('bg-gray-200 text-black', 'bg-gray-800 text-white')}>
      {children}
    </div>
  )
}

export default () => {
  return (
    <IdentityContextProvider url={`https://sureholder.netlify.app`}>
      <AuthProvider>
        <ColorModeProvider>
          <BaseStyles>
            <ApolloProvider client={client}>
              <Router>
                <Switch>
                  <PrivateRoute exact path={`/`} component={DashboardPage} />
                  <PrivateRoute exact path={`/s/:ticker`} component={StockPage} />
                  <PrivateRoute exact path={`/settings`} component={SettingsPage} />
                  <PrivateRoute admin exact path={`/admin`} component={AdminPage} />
                  <Route exact path={`/auth`} component={AuthPage} />
                  <Route component={ErrorPage} />
                </Switch>
              </Router>
            </ApolloProvider>
          </BaseStyles>
        </ColorModeProvider>
      </AuthProvider>
    </IdentityContextProvider>
  )
}