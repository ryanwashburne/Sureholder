import authorize from './utils/authorize'
import { ApolloServer, gql } from 'apollo-server-lambda'
import fetch from 'node-fetch'
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const typeDefs = gql`
  type News {
    content: String!
    url: String
  }
  type Company {
    ticker: String!
    name: String!
    weburl: String
    open: Float!
    high: Float!
    low: Float!
    price: Float!
    change: Float!
    news: [News]
  }
  type Query {
    companyByTicker(ticker: String): Company
  }
`

const companyByTicker = async (_, { ticker }, { user }) => {
  console.log('start', ticker, process.env.MY_FINNHUB_TOKEN)
  const [res1, res2] = await Promise.all([
    fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`),
    fetch(`https://finnhub.io/api/v1/stock/profile?symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`),
  ])
  const [data1, data2] = await Promise.all([
    res1.json(),
    res2.json(),
  ])
  const { name, weburl } = data2
  console.log('end')
  return {
    ticker,
    name,
    weburl,
    open: data1.o,
    high: data1.h,
    low: data1.l,
    price: data1.c,
    change: data1.c - data1.pc,
    news: [{content: 'first', url: weburl}, {content: 'second'}, {content: 'third'}]
  }
}

const resolvers = {
  Query: {
    companyByTicker,
  },
  // Mutation: {
  //   createCompany,
  //   updateCompany,
  //   createUpdate,
  // },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context, ...rest }) => ({
    user: context.clientContext.user,
    context,
    ...rest,
  }),
})

exports.handler = authorize(server.createHandler())