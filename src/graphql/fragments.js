import { gql } from 'apollo-boost'

export const OLD_NEWS_FRAGMENT = gql`
  fragment newsFragment on News {
    title
    date
    description
    url
  }
`

export const NEWS_FRAGMENT = gql`
  fragment newsFragment on News {
    category
    datetime
    headline
    id
    image
    related
    source
    summary
    url
  }
`

export const PROFILE_FRAGMENT = gql`
  fragment profileFragment on Profile {
    website
    description
    ceo
    sector
    industry
    companyName
  }
`

export const MARKET_FRAGMENT = gql`
  fragment marketFragment on Market {
    price
    changesPercentage
    change
    dayLow
    dayHigh
    yearHigh
    yearLow
    marketCap
    priceAvg50
    priceAvg200
    volume
    avgVolume
    exhange
  }
`

export const EARNINGS_FRAGMENT = gql`
  fragment earningsFragment on Earnings {
    date
    epsActual
    epsEstimate
    hour
    quarter
    revenueActual
    revenueEstimate
    year
  }
`

export const NEWS_FEED_FRAGMENT = gql`
  fragment newsFeedFragment on NewsFeed {
    ticker
    news {
      ...newsFragment
    }
  }
  ${NEWS_FRAGMENT}
`

export const EARNINGS_FEED_FRAGMENT = gql`
  fragment earningsFeedFragment on EarningsFeed {
    ticker
    earnings {
      ...earningsFragment
    }
  }
  ${EARNINGS_FRAGMENT}
`

export const COMPANY_FRAGMENT = gql`
  fragment companyFragment on Company {
    ticker
    market {
      ...marketFragment
    }
    news {
      ...newsFragment
    }
    earnings {
      ...earningsFragment
    }
    profile {
      ...profileFragment
    }
  }
  ${MARKET_FRAGMENT}
  ${NEWS_FRAGMENT}
  ${EARNINGS_FRAGMENT}
  ${PROFILE_FRAGMENT}
`

export const UPDATE_FRAGMENT = gql`
  fragment updateFragment on Update {
    company {
      ticker
    }
    title
    date
    link
  }
`