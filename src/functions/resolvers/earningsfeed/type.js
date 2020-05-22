import { gql } from 'apollo-server-lambda'

export default gql`
  type EarningsFeedType {
    ticker: String!
    earnings: EarningsType!
  }
  extend type Query {
    earningsFeed(tickers: [String!]): [EarningsFeedType!]
  }
`