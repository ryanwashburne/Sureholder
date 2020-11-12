import React from 'react'
import { IdentityContextProvider } from 'react-netlify-identity-widget'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import client from './apollo'
import { ApolloProvider } from '@apollo/client'

import { DashboardPage, SettingsPage, AdminPage, StockPage } from './pages'

import { Link } from './components'

import {
  AuthRoute,
  AuthProvider,
  ColorModeProvider,
  useColorMode,
} from './utils'

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col">
      <h1 className="text-4xl uppercase font-bold">Error</h1>
      <p>
        Page not found. <Link to="/">Go Home</Link>
      </p>
    </div>
  )
}

const AdminRoute = ({ ...props }) => {
  return (
    <AuthRoute admin>
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
                  <Route exact path={`/`} component={DashboardPage} />
                  <AdminRoute exact path={`/admin`} component={AdminPage} />
                  <Route exact path={`/s/:ticker`} component={StockPage} />
                  <AuthRoute>
                    <Route exact path={`/settings`} component={SettingsPage} />
                  </AuthRoute>
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
