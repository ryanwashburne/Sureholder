import { gql } from '@apollo/client'

import * as FRAGMENTS from './fragments'

export const COMPANY_BY_TICKER = gql`
  query ($ticker: String!, $limit: Int) {
    companyByTicker(ticker: $ticker, limit: $limit) {
      ...companyFragment
    }
  }
  ${FRAGMENTS.COMPANY_FRAGMENT}
`

export const COMPANIES_ON_DASHBOARD = gql`
  query ($tickers: [String!]) {
    companiesOnDashboard(tickers: $tickers) {
      ...companyFragment
    }
  }
  ${FRAGMENTS.COMPANY_FRAGMENT}
`

export const NEWS_FEED = gql`
  query ($tickers: [String!], $limit: Int) {
    newsFeed(tickers: $tickers, limit: $limit) {
      ...newsFeedFragment
    }
  }
  ${FRAGMENTS.NEWS_FEED_FRAGMENT}
`

export const PRESS_FEED = gql`
  query ($tickers: [String!], $limit: Int) {
    pressFeed(tickers: $tickers, limit: $limit) {
      ...pressFeedFragment
    }
  }
  ${FRAGMENTS.PRESS_FEED_FRAGMENT}
`

export const EARNINGS_FEED = gql`
  query ($tickers: [String!]) {
    earningsFeed(tickers: $tickers) {
      ...earningsFeedFragment
    }
  }
  ${FRAGMENTS.EARNINGS_FEED_FRAGMENT}
`

export const TICKER_SEARCH = gql`
  query ($search: String!) {
    tickerSearch(search: $search) {
      name
      ticker
    }
  }
`
