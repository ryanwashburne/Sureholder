import { ApolloServer, gql } from 'apollo-server-lambda'
import { authorize } from './utils'

import { CompanyResolvers, CompanyType } from './resolvers/company'
import { NewsFeedResolvers, NewsFeedType } from './resolvers/newsfeed'
import { EarningsFeedResolvers, EarningsFeedType } from './resolvers/earningsfeed'

/* Types Decleration */

const typeDefs = gql`
  ${CompanyType}
  ${NewsFeedType}
  ${EarningsFeedType}
  type Query
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

exports.handler = authorize(server.createHandler())