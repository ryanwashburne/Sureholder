const cheerio = require('cheerio')
const fetch = require('node-fetch').default
const Parser = require('rss-parser')

const parser = new Parser()

// DEF 14A -> Proxy Statement for shareholders
// 10-K -> general filings

async function getEdgarId(ticker) {
  const raw = await fetch(
    `https://www.sec.gov/cgi-bin/browse-edgar?CIK=${ticker}`,
  )
  const text = await raw.text()
  const $ = cheerio.load(text)
  return $('input[name=CIK]').val() // MIGHT CHANGE IN FUTURE
}

async function getEdgarFeed(ticker, type = '', limit = 7) {
  const id = await getEdgarId(ticker)
  const feed = await parser.parseURL(
    `https://www.sec.gov/cgi-bin/browse-edgar?CIK=${id}&type=${type}&output=atom`,
  )
  return feed.items.splice(0, limit)
}

const edgar = {
  getEdgarId,
  getEdgarFeed,
}

module.exports = edgar
