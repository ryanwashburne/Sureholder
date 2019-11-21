import React from 'react'
import { withRouter } from 'react-router-dom'
import IdentityModal, { useIdentityContext } from 'react-netlify-identity-widget'
import 'react-netlify-identity-widget/styles.css'

export default withRouter(({ history }) => {
  const [modal, changeModal] = React.useState(false)
  const identity = useIdentityContext()
  const isLoggedIn = identity && identity.isLoggedIn
  if (isLoggedIn) history.push('/dashboard')
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
        onLogin={() => history.push('/dashboard')}
        onSignup={(user) => console.log('welcome ', user.user_metadata)}
        onLogout={() => history.push('/')}
      />
    </div>
  )
})