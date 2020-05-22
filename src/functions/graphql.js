import { ApolloServer, gql } from 'apollo-server-lambda'
import fetch from 'node-fetch'
import { quote } from 'yahoo-finance/lib'

import { IEX, edgar, authorize } from './utils'


/* Types Decleration */

const typeDefs = gql`
  type News {
    datetime: Float
    headline: String
    image: String
    related: String
    source: String
    summary: String
    url: String
    ticker: String!
  }
  type Profile {
    website: String
    description: String
    sector: String
    industry: String
    companyName: String
  }
  type Market {
    price: Float
    changesPercentage: Float
    change: Float
    dayLow: Float
    dayHigh: Float
    marketCap: Float
    volume: Int,
  }
  type EarningsDate {
    date: String!
    revenue: Float
    earnings: Float
    actual: Float
    estimate: Float
  }
  type EarningsChartType {
    quarterly: [EarningsDate!]!
    currentQuarterEstimate: Float!
    currentQuarterEstimateDate: String!
    currentQuarterEstimateYear: Int!
    earningsDate: [Float!]!
  }
  type FinancialsChartType {
    yearly: [EarningsDate]!
    quarterly: [EarningsDate]!
  }
  type Earnings {
    earningsChart: EarningsChartType
    financialsChart: FinancialsChartType
  }
  type Company {
    ticker: String!
    profile: Profile!
    market: Market
    earnings: Earnings
    news: [News]
    filings: [FilingsType!]
  }
  type NewsFeed {
    ticker: String!
    news: News!
  }
  type EarningsFeed {
    ticker: String!
    earnings: Earnings!
  }
  type FilingsType {
    title: String!
    link: String!
    pubDate: String!
    content: String!
  }
  type Query {
    companyByTicker(ticker: String!, limit: Int): Company
    newsFeed(tickers: [String!], limit: Int): [NewsFeed!]
    earningsFeed(tickers: [String!]): [EarningsFeed!]
  }
`

/* Data Retrieval Functions */

async function getProfile(ticker) {
  const response = await quote(ticker, ['summaryProfile', 'price'])
  const { website, longBusinessSummary, sector, industry } = response.summaryProfile
  const { shortName } = response.price
  return {
    website,
    description: longBusinessSummary,
    sector,
    industry,
    companyName: shortName,
  }
}

async function getMarket(ticker) {
  const result = await quote(ticker, ['price'])
  const {
    regularMarketPrice,
    regularMarketChangePercent,
    regularMarketChange,
    regularMarketDayLow,
    regularMarketDayHigh,
    marketCap,
    regularMarketVolume,
  } = result.price
  return {
    price: regularMarketPrice,
    changesPercentage: regularMarketChangePercent,
    change: regularMarketChange,
    dayLow: regularMarketDayLow,
    dayHigh: regularMarketDayHigh,
    marketCap,
    volume: regularMarketVolume,
  }
}

async function getEarnings(ticker) {
  const result = await quote(ticker, ['earnings'])
  return result.earnings
}

async function getNews(ticker, limit) {
  const result = await fetch(IEX(`/${ticker}/news/last/${limit}`))
  const data = await result.json()
  return data.map((news) => ({
    ...news,
    ticker,
  }))
}

/* Resolver Functions */

const companyByTicker = async (_, { ticker, limit = 5 }) => {
  const [market, news, earnings, profile, filings] = await Promise.all([
    getMarket(ticker),
    getNews(ticker, limit),
    getEarnings(ticker),
    getProfile(ticker),
    edgar.getFeed(ticker),
  ])
  return {
    ticker: ticker.toUpperCase(),
    market,
    news,
    earnings,
    profile,
    filings,
  }
}

const newsFeed = async (_, { tickers, limit = 5 }) => {
  const allData = await Promise.all(tickers.map(ticker => getNews(ticker.toUpperCase()), Math.round(tickers / limit)))
  const allNews = []
  allData.forEach((tickerNews, i) => {
    tickerNews.forEach(news => {
      allNews.push({
        news,
        ticker: tickers[i]
      })
    })
  })
  allNews.sort((a, b) => a.news.datetime < b.news.datetime ? 1 : -1)
  return allNews.splice(0, limit)
}

const earningsFeed = async (_, { tickers }) => {
  const promises = tickers.map(ticker => getEarnings(ticker.toUpperCase()))
  const allEarnings = await Promise.all(promises)
  return allEarnings.map((earnings, i) => ({ ticker: tickers[i], earnings }))
}

/* GraphQL Configuration */

const resolvers = {
  Query: {
    companyByTicker,
    newsFeed,
    earningsFeed,
  },
  // Mutation: {s
  // },
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context, ...rest }) => {
    const user = context?.clientContext?.user
    if (!user) {
      return 
    }
    return {
      user: context?.clientContext?.user,
      context,
      ...rest,
    }
  },
})

exports.handler = authorize(server.createHandler())