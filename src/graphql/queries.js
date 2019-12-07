import { gql } from 'apollo-boost'

import * as FRAGMENTS from './fragments'

export const ALL_COMPANIES = gql`
  query {
    allCompanies {
      data {
        ...companyFragment
      }
    }
  }
  ${FRAGMENTS.COMPANY_FRAGMENT}
`

export const ALL_UPDATES = gql`
  query {
    allUpdates {
      ...updateFragment
    }
  }
  ${FRAGMENTS.UPDATE_FRAGMENT}
`

export const COMPANY_BY_TICKER = gql`
  query ($ticker: String!) {
    companyByTicker(ticker: $ticker) {
      ...companyFragment
    }
  }
  ${FRAGMENTS.COMPANY_FRAGMENT}
`

export const UPDATES_BY_TICKER = gql`
  query ($ticker: String!) {
    updatesByTicker(ticker: $ticker) {
      ...updateFragment
    }
  }
  ${FRAGMENTS.UPDATE_FRAGMENT}
`