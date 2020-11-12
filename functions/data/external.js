const edgar = require('./edgar')
const google = require('./google')

const IEX = (middle) =>
  `https://cloud.iexapis.com/stable/stock${middle}?token=${process.env.MY_IEX_TOKEN}`
const FINPREP = (middle) =>
  `https://financialmodelingprep.com/api/v3${middle}&apikey=${process.env.MY_FINPREP_TOKEN}`

module.exports = {
  IEX,
  FINPREP,
  edgar,
  google,
}
