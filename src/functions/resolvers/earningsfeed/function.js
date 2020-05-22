import { getEarnings } from '../../data'

export default async (_, { tickers }) => {
  const promises = tickers.map(ticker => getEarnings(ticker.toUpperCase()))
  const allEarnings = await Promise.all(promises)
  return allEarnings.map((earnings, i) => ({ ticker: tickers[i], earnings }))
}