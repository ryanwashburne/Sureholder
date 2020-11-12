import { gql } from 'apollo-server-lambda'

const CompanyTypes = gql`
  type ProfileType {
    website: String
    description: String
    sector: String
    industry: String
    companyName: String
  }
  
  type MarketType {
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
    quarterly: [EarningsDate!]
    currentQuarterEstimate: Float
    currentQuarterEstimateDate: String
    currentQuarterEstimateYear: Int
    earningsDate: [Float!]
  }

  type FinancialsChartType {
    yearly: [EarningsDate]
    quarterly: [EarningsDate]
  }

  type EarningsType {
    earningsChart: EarningsChartType!
    financialsChart: FinancialsChartType!
  }

  type NewsType {
    datetime: Float
    headline: String
    image: String
    related: String
    source: String
    summary: String
    url: String
    ticker: String!
  }

  type FilingsType {
    title: String!
    link: String!
    pubDate: String!
    content: String!
  }

  type UpdateType {
    id: Int!
    date: String!
    title: String!
    content: String!
    ticker: String!
    url: String
  }

  input AddUpdateInput {
    date: String!
    title: String!
    content: String!
    ticker: String!
    url: String
  }
`

export default gql`
  ${CompanyTypes}

  type CompanyType {
    ticker: String!
    profile: ProfileType!
    market: MarketType!
    earnings: EarningsType!
    news: [NewsType!]
    filings: [FilingsType!]
    updates: [UpdateType!]
  }

  extend type Query {
    companyByTicker(ticker: String!, limit: Int): CompanyType
  }

  extend type Mutation {
    addUpdate(addUpdateInput: AddUpdateInput!): UpdateType!
    delUpdate(id: Int!): Int
  }
`