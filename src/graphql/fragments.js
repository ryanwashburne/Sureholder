import { gql } from '@apollo/client'

export const NEWS_FRAGMENT = gql`
  fragment newsFragment on NewsType {
    datetime
    headline
    image
    related
    source
    summary
    url
  }
`

export const PROFILE_FRAGMENT = gql`
  fragment profileFragment on ProfileType {
    website
    description
    sector
    industry
    companyName
  }
`

export const MARKET_FRAGMENT = gql`
  fragment marketFragment on MarketType {
    price
    changesPercentage
    change
    dayLow
    dayHigh
    marketCap
    volume
  }
`

export const EARNINGS_FRAGMENT = gql`
  fragment earningsFragment on EarningsType {
    earningsChart {
      quarterly {
        date
        actual
        estimate
      }
      currentQuarterEstimate
      currentQuarterEstimateDate
      currentQuarterEstimateYear
      earningsDate
    }
    financialsChart {
      yearly {
        date
        revenue
        earnings
      }
      quarterly {
        date
        revenue
        earnings
      }
    }
  }
`

export const FILINGS_FRAGMENT = gql`
  fragment filingsFragment on FilingsType {
    title
    link
    pubDate
    content
  }
`

export const NEWS_FEED_FRAGMENT = gql`
  fragment newsFeedFragment on NewsFeedType {
    ticker
    news {
      ...newsFragment
    }
  }
  ${NEWS_FRAGMENT}
`

export const EARNINGS_FEED_FRAGMENT = gql`
  fragment earningsFeedFragment on EarningsFeedType {
    ticker
    earnings {
      ...earningsFragment
    }
  }
  ${EARNINGS_FRAGMENT}
`

export const UPDATE_FRAGMENT = gql`
  fragment updateFragment on UpdateType {
    id
    title
    date
    content
  }
`

export const COMPANY_FRAGMENT = gql`
  fragment companyFragment on CompanyType {
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
    filings {
      ...filingsFragment
    }
    updates {
      ...updateFragment
    }
  }
  ${MARKET_FRAGMENT}
  ${NEWS_FRAGMENT}
  ${EARNINGS_FRAGMENT}
  ${PROFILE_FRAGMENT}
  ${FILINGS_FRAGMENT}
  ${UPDATE_FRAGMENT}
`
