import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import {
  Frame,
} from '../components'

export default () => {
  const identity = useIdentityContext()
  const { updateUser } = identity
  return (
    <Frame>
      <button className="btn--secondary" onClick={() => {
        identity.logoutUser()
        window.location.reload()
      }}>Log Out</button>
      <button className="hidden ml-2 btn--outlined--secondary"
        onClick={() => {
          updateUser({ data: { follow: [] }})
        }}
      >Erase User Data</button>
    </Frame>
  )
}