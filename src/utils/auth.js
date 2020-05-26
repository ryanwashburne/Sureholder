import React from 'react'
import { Redirect } from 'react-router-dom'
import { useIdentityContext } from 'react-netlify-identity'

export const NONUSER = 0
export const USER = 1
export const ADMIN = 3

const getName = mode => {
  switch (mode) {
    case USER:
      return 'USER'
    case ADMIN:
      return 'ADMIN'
    default:
      return 'NONUSER'
  }
}

const AuthContext = React.createContext()
export const useAuth = () => React.useContext(AuthContext)
export const AuthProvider = ({ children }) => {
  const identity = useIdentityContext()
  const { roles } = identity?.user?.app_metadata
  const admin = roles?.indexOf('admin') > -1
  const [mode, changeViewingMode] = React.useState(admin ? ADMIN : USER)
  return (
    <AuthContext.Provider value={{
      isAdmin: admin,
      viewingMode: {
        id: mode,
        name: getName(mode)
      },
      changeViewingMode,
      ...identity,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthRoute = ({ admin, children }) => {
  const [loading, changeLoading] = React.useState(true)
  const { isLoggedIn, user, viewingMode } = useAuth()
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
  }, [loading, now, user])

  if (loading) {
    return null
  }

  if (!isLoggedIn || !user) {
    return <Redirect to="/auth" />
  }

  if (admin && viewingMode.id !== ADMIN) {
    return <Redirect to="/" />
  }

  return children
}