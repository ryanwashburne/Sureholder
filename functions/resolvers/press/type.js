import { gql } from 'apollo-server-lambda'

export default gql`
  type PressFeedType {
    ticker: String!
    press: PressType!
  }
  extend type Query {
    pressFeed(tickers: [String!], limit: Int): [PressFeedType!]!
  }
`
