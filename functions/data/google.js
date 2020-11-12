const { GoogleSpreadsheet } = require('google-spreadsheet')
const { google } = require('googleapis')

const credentials = {
  client_email: process.env.MY_GOOGLE_EMAIL,
  private_key: process.env.MY_GOOGLE_KEY.replace(
    new RegExp('\\\\n', 'g'),
    '\n',
  ),
}
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
})
const drive = google.drive({
  version: 'v3',
  auth,
})
const params = {
  q: `'${process.env.GOOGLE_UPDATES_ID}' in parents`,
}

// unused vv
const loadDocByTicker = async (ticker) => {
  const res = await drive.files.list(params)
  const data = res.data.files.filter((file) => {
    return file.name.toUpperCase() === ticker.toUpperCase()
  })
  if (data.length === 0) {
    throw new Error('No ticker found in folder')
  }
  const id = data[0].id
  const doc = new GoogleSpreadsheet(id)
  await doc.useServiceAccountAuth(credentials)
  await doc.loadInfo()
  return doc
}
// unused ^^

const loadDoc = async () => {
  const doc = new GoogleSpreadsheet(process.env.MY_GOOGLE_UPDATES_ID)
  await doc.useServiceAccountAuth(credentials)
  await doc.loadInfo()
  return doc
}
const loadSheet = async () => {
  const doc = await loadDoc()
  return doc.sheetsByIndex[0]
}
const loadRows = async () => {
  const sheet = await loadSheet()
  return await sheet.getRows()
}

export const setSheet = async (ticker, data) => {
  const sheet = await loadSheet()
  const row = await sheet.addRow({ ticker, ...data })
  return {
    ...row,
    id: row._rowNumber,
  }
}

export const getSheet = async (ticker) => {
  const rows = await loadRows()
  const filtered = rows.filter((row) => {
    return row.ticker.toUpperCase() === ticker.toUpperCase()
  })
  return filtered.map((row) => ({ ...row, id: row._rowNumber })).reverse()
}

export const delUpdate = async (id) => {
  const rows = await loadRows()
  let rtn
  rows.every(async (row) => {
    if (row._rowNumber === id) {
      await row.delete()
      rtn = id
      return false
    }
    return true
  })
  return rtn
}
