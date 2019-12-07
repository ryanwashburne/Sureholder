import { gql } from 'apollo-boost'

import * as FRAGMENTS from './fragments'

export const CREATE_COMPANY = gql`
  mutation ($CompanyInput: CompanyInput!) {
    createCompany(CompanyInput: $CompanyInput) {
      ...companyFragment
    }
  }
  ${FRAGMENTS.COMPANY_FRAGMENT}
`


export const UPDATE_COMPANY = gql`
  mutation ($CompanyInput: CompanyInput!) {
    updateCompany(CompanyInput: $CompanyInput) {
      ...companyFragment
    }
  }
  ${FRAGMENTS.COMPANY_FRAGMENT}
`

export const CREATE_UPDATE = gql`
  mutation ($UpdateInput: UpdateInput!) {
    createUpdate(UpdateInput: $UpdateInput) {
      ...updateFragment
    }
  }
  ${FRAGMENTS.UPDATE_FRAGMENT}
`