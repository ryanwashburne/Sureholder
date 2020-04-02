import { gql } from 'apollo-boost'

export const NEWS_FRAGMENT = gql`
  fragment newsFragment on News {
    content
    url
  }
`

export const COMPANY_FRAGMENT = gql`
  fragment companyFragment on Company {
    ticker
    name
    weburl
    open
    high
    low
    price
    change
    news {
      ...newsFragment
    }
  }
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