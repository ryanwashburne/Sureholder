import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import {
  Dashboard,
} from '../../components'

export default () => {
  const identity = useIdentityContext()
  const { updateUser } = identity
  return (
    <Dashboard>
      <button className="btn--secondary" onClick={() => {
        identity.logoutUser()
        window.location.reload()
      }}>Log Out</button>
      <button className="hidden ml-2 btn--outlined--secondary"
        onClick={() => {
          updateUser({ data: { follow: [] }})
        }}
      >Erase User Data</button>
    </Dashboard>
  )
}