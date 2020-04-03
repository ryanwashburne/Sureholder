import { gql } from 'apollo-boost'

export const NEWS_FRAGMENT = gql`
  fragment newsFragment on News {
    title
    date
    description
    url
  }
`

export const MARKET_FRAGMENT = gql`
  fragment marketFragment on Market {
    name
    weburl
    open
    high
    low
    price
    change
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

export const COMPANY_FRAGMENT = gql`
  fragment companyFragment on Company {
    ticker
    market {
      ...marketFragment
    }
    news {
      ...newsFragment
    }
  }
  ${MARKET_FRAGMENT}
  ${NEWS_FRAGMENT}
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