import React from 'react'

import { useMutation } from '@apollo/react-hooks'
import * as MUTATIONS from '../graphql/mutations'

import {
  Frame,
} from '../components'

export default () => {
  const [input, changeInput] = React.useState('')
  const [echo, { data, error }]= useMutation(MUTATIONS.ECHO, { variables: { input }})

  return (
    <Frame>
      <p>Admin</p>
      <p>{error}</p>
      <p>{data?.echo}</p>
      <form onSubmit={e => { e.preventDefault(); echo() }}>
        <label htmlFor="test-data">Echo</label>
        <input name="test-data" value={input} onChange={e => changeInput(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </Frame>
  )
}