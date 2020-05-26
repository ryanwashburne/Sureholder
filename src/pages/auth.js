import React from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import IdentityModal from 'react-netlify-identity-widget'
import 'react-netlify-identity-widget/styles.css'

import {
  useAuth,
} from '../utils'

export default withRouter(({ history }) => {
  const [modal, changeModal] = React.useState(false)
  const { isLoggedIn } = useAuth()
  if (isLoggedIn) {
    return <Redirect to="/" />
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-2">Sureholder</h1>
      <button
        className="btn"
        onClick={() => changeModal(true)}
      >Sign In</button>
      <IdentityModal
        showDialog={modal}
        onCloseDialog={() => changeModal(false)}
        onLogin={() => history.push('/')}
        onLogout={() => history.push('/')}
      />
    </div>
  )
})