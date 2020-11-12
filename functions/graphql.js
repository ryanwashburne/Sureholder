import { ApolloServer, gql } from 'apollo-server-lambda'
// import { authorize } from './utils'

import { CompanyResolvers, CompanyType } from './resolvers/company'
import { NewsFeedResolvers, NewsFeedType } from './resolvers/newsfeed'
import {
  EarningsFeedResolvers,
  EarningsFeedType,
} from './resolvers/earningsfeed'

import { tickerSearch } from './data'

/* Types Decleration */

const typeDefs = gql`
  ${CompanyType}
  ${NewsFeedType}
  ${EarningsFeedType}
  type SearchType {
    name: String!
    ticker: String!
  }
  type Query {
    tickerSearch(search: String!): [SearchType!]
  }
  type Mutation {
    echo(input: String!): String!
  }
`

/* GraphQL Configuration */

const resolvers = {
  Query: {
    ...CompanyResolvers.Query,
    ...NewsFeedResolvers.Query,
    ...EarningsFeedResolvers.Query,
    tickerSearch: async (_, { search }) => await tickerSearch(search),
  },
  Mutation: {
    ...CompanyResolvers.Mutation,
    echo: (_, { input }) => input,
  },
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context, ...rest }) => ({
    user: context?.clientContext?.user,
    context,
    ...rest,
  }),
})

exports.handler = server.createHandler()
