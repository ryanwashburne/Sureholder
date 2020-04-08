const { GoogleSpreadsheet } = require('google-spreadsheet')
const { google } = require('googleapis')
const moment = require('moment')
if (process.env.NODE_ENV !== 'production' || process.env.NETLIFY_DEV === 'true') require('dotenv').config()

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.MY_GOOGLE_EMAIL,
    private_key: process.env.MY_GOOGLE_KEY.replace(new RegExp('\\\\n', 'g'), '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
})
const drive = google.drive({
  version: 'v3',
  auth,
})
const folderId = '1lkJIo86kd0VIUZvnV7USCd_GNs0f8W7N'
const params = {
  q: `'${folderId}' in parents`
}

async function getFileId(ticker) {
  const res = await drive.files.list(params)
  const data = res.data.files.filter(file => {
    return file.name === ticker
  })
  if (data.length > 0) {
    return data[0].id
  }
  return null
}

async function main(ticker, limit) {
  const id = await getFileId(ticker)
  if (!id) {
    return []
  }
  const doc = new GoogleSpreadsheet(id)
  doc.useApiKey(process.env.MY_GOOGLE_ACCESS_KEY)
  await doc.loadInfo()
  const sheet = doc.sheetsByIndex[0]
  const rows = await sheet.getRows()
  const filteredRows = rows.filter((row, i) => {
    if (i > limit) {
      return false
    }
    return (
      row.PressReleasesTitle.length > 0 &&
      row.PressReleasesDateTime.length > 0 &&
      row.Description.length > 0 &&
      row.PressReleasesUrl.length > 0
    )
  })
  return filteredRows.map(row => ({
    category: 'earnings',
    related: ticker,
    source: 'googlesheets',
    headline: row.PressReleasesTitle.trim(),
    datetime: moment(new Date(row.PressReleasesDateTime.trim())).unix(),
    summary: row.Description.trim(),
    url: row.PressReleasesUrl.trim(),
  }))
}

module.exports = main