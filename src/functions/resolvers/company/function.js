import { getMarket, getNews, getEarnings, getProfile, getEdgarFeed } from '../../data'

export default async (_, { ticker, limit = 5 }) => {
  const [market, news, earnings, profile, filings] = await Promise.all([
    getMarket(ticker),
    getNews(ticker, limit),
    getEarnings(ticker),
    getProfile(ticker),
    getEdgarFeed(ticker),
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