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