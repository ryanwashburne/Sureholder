import { gql } from 'apollo-boost'

export const COMPANY_FRAGMENT = gql`
  fragment companyFragment on Company {
    logo
    ticker
    # name
    # market {
    #   open
    #   high
    #   low
    #   price
    #   change
    # }
  }
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