import { gql } from '@apollo/client'

import * as FRAGMENTS from './fragments'

export const ECHO = gql`
  mutation($input: String!) {
    echo(input: $input)
  }
`

export const ADD_UPDATE = gql`
  mutation($addUpdateInput: AddUpdateInput!) {
    addUpdate(addUpdateInput: $addUpdateInput) {
      ...updateFragment
    }
  }
  ${FRAGMENTS.UPDATE_FRAGMENT}
`

export const DELETE_UPDATE = gql`
  mutation($id: Int!) {
    delUpdate(id: $id)
  }
`
