import * as QUERIES from '../../graphql'
import fetch from 'node-fetch'
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

import ApolloClient from 'apollo-boost'

const uri = `https://graphql.fauna.com/graphql`

// const link = createHttpLink({ uri: uri, fetch: fetch })
const client = new ApolloClient({
  fetch,
  uri,
  headers: {
    Authorization: `Bearer ${process.env.FAUNADB_SERVER_SECRET}`
  },
})



const allCompanies = (args, context) => {
  // console.log(args, context)
  return [
    {
      ticker: 'AAPL',
      logo: null,
    },
  ]
}

const companyByTicker = async (root, args, context) => {
  try {
    return await client.query({ query: QUERIES.LOAD_COMPANIES })
  } catch(e) {
    console.error(e)
    return null
  }
}

const allUpdates = async (r, a, c) => {
  try {
    const response = await client.query({ query: QUERIES.ALL_UPDATES })
    console.log('FROM FAUNADB:')
    console.log(response)
    return response
  } catch(e) {
    console.error(e)
    return null
  }
}

export default {
  Query: {
    allCompanies: (root, args, context) => allCompanies(args, context),
    allUpdates,
    companyByTicker,
  },
  // Mutation: {
  //   createOrganization: (root, args, context) => createOrganization(args, context),
  //   leaveOrganization: (root, args, context) => leaveOrganization(args, context),
  //   decideInvite: (root, args, context) => decideInvite(args, context),
  //   cancelRequest: (root, args, context) => cancelRequest(args, context),
  // }
}