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

export const MARKET_FRAGMENT = gql`
  fragment marketFragment on Market {
    open
    high
    low
    price
    change
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
  }
  ${MARKET_FRAGMENT}
  ${NEWS_FRAGMENT}
  ${EARNINGS_FRAGMENT}
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