const cheerio = require('cheerio')
const fetch = require('node-fetch').default
// const convert = require('xml-js')

// if (process.env.NODE_ENV !== 'production' || process.env.NETLIFY_DEV === 'true') require('dotenv').config()

// `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${id}&start=0&count=5&output=atom`

async function getId(ticker) {
  try {
    const raw = await fetch(`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${ticker}`)
    const text = await raw.text()
    const $ = cheerio.load(text)
    const link = $('#secBetaGraphic a')[0].attribs.href
    const params = link.split('?')[1].split('&')
    let id
    params.every(param => {
      const sides = param.split('=')
      if (sides[0].toUpperCase() === 'CIK') {
        id = sides[1]
        return false
      }
      return true
    })
    return id
  } catch(e) {
    console.error(e)
  }
  return null
}

async function getInfo(id) {
  try {
    const raw = await fetch(`https://www.sec.gov/cgi-bin/browse-edgar?&CIK=${id}&output=atom`)
    const text = await raw.text()
    const $ = cheerio.load(text, { xmlMode: true })
    // const rtnObj = {};
    const city = $('company-info addresses address city')[0].children[0].data
    // return $('company-info addresses address city')
    return { city }
  } catch(e) {
    console.error(e)
  }
}

async function getFeed(id) {
  try {
    const raw = await fetch(`https://www.sec.gov/cgi-bin/browse-edgar?&CIK=${id}&output=atom`)
    const text = await raw.text()
    const $ = cheerio.load(text, { xmlMode: true })
    return $('entry form-name').toArray().map((el) => el.children[0].data)
  } catch(e) {
    console.error(e)
  }
}

async function main(ticker = 'AAPL') {
  const id = await getId(ticker)
  if (id) {
    // const feed = await getFeed(id)
    const info = await getInfo(id)
    console.dir(info)
  }
  return null
}

module.exports = main