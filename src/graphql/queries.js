import { gql } from 'apollo-boost'

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
  query ($tickers: [String!]) {
    newsFeed(tickers: $tickers) {
      ...newsFeedFragment
    }
  }
  ${FRAGMENTS.NEWS_FEED_FRAGMENT}
`