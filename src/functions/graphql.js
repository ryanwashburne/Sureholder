import authorize from './utils/authorize'
import { ApolloServer, gql } from 'apollo-server-lambda'
import fetch from 'node-fetch'
import moment from 'moment'
import google from './utils/google'
if (process.env.NODE_ENV !== 'production' || process.env.NETLIFY_DEV === 'true') require('dotenv').config()

const typeDefs = gql`
  type OLDNews {
    title: String!
    date: String!
    description: String
    url: String
  }
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
  type Market {
    open: Float!
    high: Float!
    low: Float!
    price: Float!
    change: Float!
  }
  type Earnings {
    date: String!
    epsActual: Int!
    epsEstimate: Int!
    hour: String!
    quarter: Int!
    revenueActual: Int!
    revenueEstimate: Int!
    year: Int!
  }
  type Company {
    ticker: String!
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

// USES FINNHUB
// [now a premium feature]
async function OLDgetMarket(ticker) {
  const [res1, res2] = await Promise.all([
    fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`),
    fetch(`https://finnhub.io/api/v1/stock/profile?symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`),
  ])
  const [data1, data2] = await Promise.all([
    res1.json(),
    res2.json(),
  ])
  const { name, weburl } = data2
  return {
    name,
    weburl,
    open: data1.o.toFixed(2),
    high: data1.h.toFixed(2),
    low: data1.l.toFixed(2),
    price: data1.c.toFixed(2),
    change: (((data1.c - data1.pc) / data1.pc) * 100).toFixed(2),
  }
}
async function getMarket(ticker) {
  const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`)
  const data = await res.json()
  return {
    open: data.o.toFixed(2),
    high: data.h.toFixed(2),
    low: data.l.toFixed(2),
    price: data.c.toFixed(2),
    change: (((data.c - data.pc) / data.pc) * 100).toFixed(2),
  }
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
  const [market, news, earnings] = await Promise.all([
    getMarket(ticker),
    getNews(ticker, limit),
    getEarnings(ticker, moment().add(3, 'months').format('YYYY-MM-DD')),
  ])
  return {
    ticker: ticker.toUpperCase(),
    market,
    news,
    earnings,
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
    // companiesOnDashboard,
    newsFeed,
    earningsFeed,
  },
  // Mutation: {
  //   createCompany,
  //   updateCompany,
  //   createUpdate,
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

// const handler = server.createHandler()
// console.log(handler)

// exports.handler = authorize(handler)

exports.handler = server.createHandler()