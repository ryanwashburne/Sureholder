import React from 'react'
import { Redirect } from 'react-router-dom'
import { useIdentityContext } from 'react-netlify-identity'

export default ({ children }) => {
  const [loading, changeLoading] = React.useState(true)
  const identity = useIdentityContext()
  const { user } = identity
  const isLoggedIn = identity && identity.isLoggedIn
  const now = new Date().getTime()

  React.useEffect(() => {
    async function loadJwt() {
      try {
        const { token } = user
        const { expires_at } = token
        if (expires_at - now <= 0) {
          await user.jwt(true)
        }
        changeLoading(false)
      } catch(_) {
        changeLoading(false)
      }
    }
    loadJwt()
  }, [loading])

  if (loading) {
    return null
  }

  if (!isLoggedIn || !user) { return <Redirect to="/auth" /> }

  return children
}