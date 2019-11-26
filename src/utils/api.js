const api = {}
const user = JSON.parse(localStorage.getItem('gotrue.user'))

const authFetch = (url, config = {}) => {
  return fetch(url, {
    ...config,
    headers: {
      'Authorization': `Bearer ${user.token.access_token}`,
      ...config.headers,
    },
  })
}

api.newUpdate = async ({ ticker, title, date }) => {
  try {
    await authFetch('/.netlify/functions/new-update', {
      method: 'POST',
      body: JSON.stringify({
        ticker,
        title,
        date,
      }),
    })
  } catch(e) {
    throw e
  }
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

    await authFetch('/.netlify/functions/update-logo', {
      method: 'POST',
      body: JSON.stringify({
        ticker,
        type,
      })
    })
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

api.loadUpdates = async (ticker) => {
  try {
    return await authFetch(`/.netlify/functions/load-updates?ticker=${ticker}`)
  } catch(e) {
    throw e
  }
}

api.loadUpdatesByTickers = async (tickers) => {
  try {
    const data = await authFetch(`/.netlify/functions/load-updates?ticker=${tickers.join(',')}`)
    return await data.json()
  } catch(e) {
    throw e
  }
}

export default api