const edgar = require('./edgar')

if (process.env.NODE_ENV !== 'production' || process.env.NETLIFY_DEV === 'true') require('dotenv').config()

const IEX = middle => `https://cloud.iexapis.com/stable/stock${middle}?token=${process.env.MY_IEX_TOKEN}`

module.exports = {
  IEX,
  edgar,
}