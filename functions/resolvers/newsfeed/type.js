import { gql } from 'apollo-server-lambda'

export default gql`
  type NewsFeedType {
    ticker: String!
    news: NewsType!
  }
  extend type Query {
    newsFeed(tickers: [String!], limit: Int): [NewsFeedType!]
  }
`