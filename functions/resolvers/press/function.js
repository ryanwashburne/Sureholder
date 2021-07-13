import moment from 'moment'
import Promise from 'promise'
import { getPress } from '../../data'

const pressFeed = async (_, { tickers, limit = 5 }) => {
  const from = moment().subtract(1, 'week').format('YYYY-MM-DD')
  const allData = await Promise.all(
    tickers.map((ticker) => getPress(ticker, from)),
  )
  const allPress = []
  allData.forEach((tickerPress, i) => {
    tickerPress.forEach((press) => {
      allPress.push({
        press,
        ticker: tickers[i],
      })
    })
  })
  allPress.sort((a, b) => (a.press.datetime < b.press.datetime ? 1 : -1))
  return allPress.slice(0, limit)
}

export default {
  Query: {
    pressFeed,
  },
}
