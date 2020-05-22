import { ApolloServer, gql } from 'apollo-server-lambda'
import { authorize } from './utils'

import { companyByTicker, CompanyType} from './resolvers/company'
import { newsFeed, NewsFeedType } from './resolvers/newsfeed'
import { earningsFeed, EarningsFeedType } from './resolvers/earningsfeed'

/* Types Decleration */

const typeDefs = gql`
  ${CompanyType}
  ${NewsFeedType}
  ${EarningsFeedType}
  type Query {
    hello: String!
  }
`

/* GraphQL Configuration */

const resolvers = {
  Query: {
    companyByTicker,
    newsFeed,
    earningsFeed,
    hello: () => 'ok!',
  },
  // Mutation: {
  // },
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