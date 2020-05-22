const cheerio = require('cheerio')
const fetch = require('node-fetch').default
const Parser = require('rss-parser')

const parser = new Parser()

// DEF 14A -> Proxy Statement for shareholders
// 10-K -> general filings

async function getEdgarId(ticker) {
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
}

async function getEdgarFeed(ticker, type = '', limit = 7) {
  const id = await getEdgarId(ticker)
  const feed = await parser.parseURL(`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${id}&type=${type}&output=atom`)
  return feed.items.splice(0, limit)
}

const edgar = {
  getEdgarId,
  getEdgarFeed,
}

module.exports = edgar