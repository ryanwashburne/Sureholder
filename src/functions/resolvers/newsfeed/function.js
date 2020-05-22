import { getNews } from '../../data'

export default async (_, { tickers, limit = 5 }) => {
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