import React from 'react'
import { useIdentityContext } from 'react-netlify-identity'

import {
  Frame,
  Helmet,
  Card,
} from '../components'
import { useColorMode } from '../utils'

export default () => {
  const { cm } = useColorMode()
  const identity = useIdentityContext()
  const { updateUser } = identity
  return (
    <Frame>
      <Helmet>Settings</Helmet>
      <Card title="Settings:">
        <button className={`btn--${cm()}--secondary`} onClick={() => {
          identity.logoutUser()
          window.location.reload()
        }}>Log Out</button>
        <button className={`hidden ml-2 btn--${cm()}--outlined--secondary`}
          onClick={() => {
            updateUser({ data: { follow: [] }})
          }}
        >Erase User Data</button>
        <button className={`ml-8 btn--${cm()}--outlined--secondary`}>Test</button>
      </Card>
    </Frame>
  )
}