import { GraphQLClient } from 'graphql-request'

const api = {}

let token
try {
  token = JSON.parse(localStorage.getItem('gotrue.user')).token.access_token
} catch(_) {}

const uri = '/.netlify/functions/newql'
const client = new GraphQLClient(uri, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
export const request = (q, v) => client.request(q, v)

const authFetch = (url, config = {}) => {
  return fetch(url, {
    ...config,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...config.headers,
    },
  })
}

api.uploadFile = async ({ ticker, file, fileType }) => {
  try {
    const type = fileType.split('/')[1]
    let data = await authFetch('/.netlify/functions/s3-upload', {
      method: 'POST',
      body: JSON.stringify({
        fileName: `${ticker.toUpperCase()}.${type}`,
        fileType,
      })
    })
    data = await data.json()
    await fetch(data.uploadURL, {
      method: 'PUT',
      body: file,
    })
    return `https://sureholder.s3-us-west-2.amazonaws.com/${ticker.toUpperCase()}.${type}`
  } catch(e) {
    throw e
  }
}

// api.retrieveFile = async (ticker) => {
//   try {
//     return await authFetch(`/.netlify/functions/s3-retrieve?company=${ticker}`)
//   } catch(e) {
//     throw e
//   }
// }

export default api