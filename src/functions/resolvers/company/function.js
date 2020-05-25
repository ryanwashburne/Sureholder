import { getMarket, getNews, getEarnings, getProfile, getEdgarFeed, getGoogleSheet, setGoogleSheet, delGoogleUpdate } from '../../data'

const companyByTicker = async (_, { ticker, limit = 5 }) => {
  const [market, news, earnings, profile, filings, updates] = await Promise.all([
    getMarket(ticker),
    getNews(ticker, limit),
    getEarnings(ticker),
    getProfile(ticker),
    getEdgarFeed(ticker),
    getGoogleSheet(ticker),
  ])
  return {
    ticker: ticker.toUpperCase(),
    market,
    news,
    earnings,
    profile,
    filings,
    updates,
  }
}

const addUpdate = async (_, { addUpdateInput }) => {
  const { ticker, ...data } = addUpdateInput
  return await setGoogleSheet(ticker, data)
}

const delUpdate = async (_, { id }) => {
  return await delGoogleUpdate(id)
}

export default {
  Query: {
    companyByTicker,
  },
  Mutation: {
    addUpdate,
    delUpdate,
  },
}