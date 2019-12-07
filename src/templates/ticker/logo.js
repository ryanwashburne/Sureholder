import React from 'react'

import { useMutation } from '@apollo/react-hooks'

import api from '../../utils/api'

import * as MUTATIONS from '../../graphql/mutations'

export default ({ admin, ticker, src }) => {
  const [file, changeFile] = React.useState()

  const [updateLogo, { data }] = useMutation(MUTATIONS.UPDATE_COMPANY)

  function onChange(e) {
    changeFile(e.target.files[0])
  }
  async function onSubmit(e) {
    e.preventDefault()
    const fileData = new FormData()
    fileData.append('Content-Type', file.type)
    fileData.append('file', file)
    try {
      const logo = await api.uploadFile({
        ticker,
        file,
        fileName: file.name,
        fileType: file.type,
      })
      const variables = {
        CompanyInput: {
          ticker,
          logo,
        },
      }
      await updateLogo({
        variables
      })
      window.location.reload()
    } catch(e) {
      console.error(e)
    }
  }
  return (
    <form onSubmit={onSubmit}>
      {!src && <div className="border border-black rounded" style={{ width: 100, height: 100 }} />}
      {src && <img src={src} style={{ maxWidth: 100 }} />}
      {admin &&
        <div>
          <input type="hidden" name="MAX_FILE_SIZE" value="4194304" />
          <input type="file" onChange={onChange} />
          {file &&
            <button className="btn--outlined--secondary" type="submit">Submit</button>
          }
        </div>
      }
    </form>
  )
}