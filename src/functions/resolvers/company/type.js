import { gql } from 'apollo-server-lambda'

const ProfileType = gql`
  type ProfileType {
    website: String
    description: String
    sector: String
    industry: String
    companyName: String
  }
`
const MarketType = gql`
  type MarketType {
    price: Float
    changesPercentage: Float
    change: Float
    dayLow: Float
    dayHigh: Float
    marketCap: Float
    volume: Int,
  }
`

const EarningsType = gql`
  type EarningsDate {
    date: String!
    revenue: Float
    earnings: Float
    actual: Float
    estimate: Float
  }
  type EarningsChartType {
    quarterly: [EarningsDate!]!
    currentQuarterEstimate: Float!
    currentQuarterEstimateDate: String!
    currentQuarterEstimateYear: Int!
    earningsDate: [Float!]!
  }
  type FinancialsChartType {
    yearly: [EarningsDate]!
    quarterly: [EarningsDate]!
  }
  type EarningsType {
    earningsChart: EarningsChartType
    financialsChart: FinancialsChartType
  }
`

const NewsType = gql`
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
`

const FilingsType = gql`
  type FilingsType {
    title: String!
    link: String!
    pubDate: String!
    content: String!
  }
`

export default gql`
  ${ProfileType}
  ${MarketType}
  ${EarningsType}
  ${NewsType}
  ${FilingsType}

  type CompanyType {
    ticker: String!
    profile: ProfileType!
    market: MarketType!
    earnings: EarningsType!
    news: [NewsType!]
    filings: [FilingsType!]
  }

  extend type Query {
    companyByTicker(ticker: String!, limit: Int): CompanyType
  }
`