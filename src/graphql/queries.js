import { gql } from 'apollo-boost'

import * as FRAGMENTS from './fragments'

export const COMPANY_BY_TICKER = gql`
  query ($ticker: String!) {
    companyByTicker(ticker: $ticker) {
      ...companyFragment
    }
  }
  ${FRAGMENTS.COMPANY_FRAGMENT}
`