// import authorize from './utils/authorize'
import { ApolloServer, gql } from 'apollo-server-lambda'
import fetch from 'node-fetch'
import moment from 'moment'
import google from './utils/google'
import rss from './utils/rss'
if (process.env.NODE_ENV !== 'production' || process.env.NETLIFY_DEV === 'true') require('dotenv').config()

const typeDefs = gql`
  type News {
    category: String
    datetime: Int
    headline: String
    id: Int
    image: String
    related: String
    source: String
    summary: String
    url: String
  }
  type Profile {
    website: String
    description: String
    ceo: String
    sector: String
    industry: String
    companyName: String
  }
  type Market {
    # price: Float!
    # dayHigh: Float!
    # dayLow: Float!
    # price: Float!
    # change: Float!
    price: Float
    changesPercentage: Float
    change: Float
    dayLow: Float
    dayHigh: Float
    yearHigh: Float
    yearLow: Float
    marketCap: Float
    priceAvg50: Float
    priceAvg200: Float
    volume: Int,
    avgVolume: Int,
    exhange: String
  }
  type Earnings {
    date: String!
    epsActual: Float!
    epsEstimate: Float!
    hour: String!
    quarter: Int!
    revenueActual: Float!
    revenueEstimate: Float!
    year: Int!
  }
  type Company {
    ticker: String!
    profile: Profile!
    market: Market
    earnings: [Earnings]
    news: [News]
  }
  type NewsFeed {
    ticker: String!
    news: News!
  }
  type EarningsFeed {
    ticker: String!
    earnings: Earnings!
  }
  type Query {
    companyByTicker(ticker: String!, limit: Int): Company
    newsFeed(tickers: [String!], limit: Int): [NewsFeed!]
    earningsFeed(tickers: [String!], limit: Int): [EarningsFeed!]
  }
`

async function getProfile(ticker) {
  const response = await fetch(`https://financialmodelingprep.com/api/v3/company/profile/${ticker}`)
  const data = await response.json()
  return data.profile
}

// USES FINNHUB
// [now a premium feature]
// async function OLDgetMarket(ticker) {
//   const [res1, res2] = await Promise.all([
//     fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`),
//     fetch(`https://finnhub.io/api/v1/stock/profile?symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`),
//   ])
//   const [data1, data2] = await Promise.all([
//     res1.json(),
//     res2.json(),
//   ])
//   const { name, weburl } = data2
//   return {
//     name,
//     weburl,
//     open: data1.o.toFixed(2),
//     high: data1.h.toFixed(2),
//     low: data1.l.toFixed(2),
//     price: data1.c.toFixed(2),
//     change: (((data1.c - data1.pc) / data1.pc) * 100).toFixed(2),
//   }
// }
// async function getMarket(ticker) {
//   const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`)
//   const data = await res.json()
//   return {
//     open: data.o.toFixed(2),
//     high: data.h.toFixed(2),
//     low: data.l.toFixed(2),
//     price: data.c.toFixed(2),
//     change: (((data.c - data.pc) / data.pc) * 100).toFixed(2),
//   }
// }

async function getMarket(tickers = []) {
  const res = await fetch(`https://financialmodelingprep.com/api/v3/quote/${tickers.join()}`)
  const data = await res.json()
  return data
}

// USES FINNHUB
async function getEarnings(ticker, end, limit = 5) {
  const date = moment().format('YYYY-MM-DD')
  const res = await fetch(`https://finnhub.io/api/v1/calendar/earnings?from=${date}&to=${end}&symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`)
  const { earningsCalendar } = await res.json()
  return earningsCalendar.splice(0, limit)
}

async function getNews(ticker, limit = 10) {
  const res = await fetch(`https://finnhub.io/api/v1/news/${ticker}?token=${process.env.MY_FINNHUB_TOKEN}`)
  const data = await res.json()
  return data.splice(0, limit)
}

async function getGoogleNews(ticker, limit = 5) {
  return await google(ticker.toUpperCase(), limit)
}

const companyByTicker = async (_, { ticker, limit }) => {
  // await rss()
  const [market, news, earnings, profile] = await Promise.all([
    getMarket([ticker]),
    getNews(ticker, limit),
    getEarnings(ticker, moment().add(3, 'months').format('YYYY-MM-DD')),
    getProfile(ticker),
  ])
  return {
    ticker: ticker.toUpperCase(),
    market: market[0],
    news,
    earnings,
    profile,
  }
}

const newsFeed = async (_, { tickers, limit = 10 }) => {
  const promises = tickers.map(ticker => Promise.all([getNews(ticker.toUpperCase(), limit), getGoogleNews(ticker.toUpperCase(), limit)]))
  const allNews = await Promise.all(promises)
  const parsedData = allNews.map((tickerNews, i) => {
    const apinews = tickerNews[0].map((item) => ({news: {...item}, ticker: tickers[i]}))
    const googlenews = tickerNews[1].map((item) => ({news: {...item}, ticker: tickers[i]}))
    return [...apinews, ...googlenews]
  })
  return parsedData.flat().sort((a, b) => a.news.datetime < b.news.datetime ? 1 : -1).splice(0, limit)
}

const earningsFeed = async (_, { tickers, limit = 5 }) => {
  const promises = tickers.map(ticker => getEarnings(ticker.toUpperCase(), moment().add(3, 'months').format('YYYY-MM-DD'), limit))
  const allEarnings = await Promise.all(promises)
  const parsedData = allEarnings.map((tickerEarnings, i) => tickerEarnings.map((item) => ({earnings: {...item}, ticker: tickers[i]})).splice(0, limit))
  return parsedData.flat().sort((a, b) => a.news.datetime < b.news.datetime ? 1 : -1).splice(0, limit)
}

const resolvers = {
  Query: {
    companyByTicker,
    newsFeed,
    earningsFeed,
  },
  // Mutation: {
  // },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context, ...rest }) => ({
    user: context.clientContext.user,
    context,
    ...rest,
  }),
})

exports.handler = server.createHandler()