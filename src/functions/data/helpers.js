import fetch from 'node-fetch'
import { quote } from 'yahoo-finance/lib'

import { IEX, edgar } from './external'

export const getProfile = async (ticker) => {
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

export const getMarket = async (ticker) => {
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

export const getEarnings = async (ticker) => {
  const result = await quote(ticker, ['earnings'])
  return result.earnings
}

export const getNews = async (ticker, limit) => {
  const result = await fetch(IEX(`/${ticker}/news/last/${limit}`))
  const data = await result.json()
  return data.map((news) => ({
    ...news,
    ticker,
  }))
}

/* EDGAR Helpers */
export const getEdgarId = edgar.getEdgarId
export const getEdgarFeed = edgar.getEdgarFeed