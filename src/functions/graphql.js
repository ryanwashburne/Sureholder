import authorize from './utils/authorize'
import { ApolloServer, gql } from 'apollo-server-lambda'
import fetch from 'node-fetch'
import google from './utils/google'
if (process.env.NODE_ENV !== 'production' || process.env.NETLIFY_DEV === 'true') require('dotenv').config()

const typeDefs = gql`
  type News {
    title: String!
    date: String!
    description: String
    url: String
  }
  type Company {
    ticker: String!
    name: String
    weburl: String
    open: Float!
    high: Float!
    low: Float!
    price: Float!
    change: Float!
    news: [News]
  }
  type Query {
    companyByTicker(ticker: String!, limit: Int): Company
  }
`

const companyByTicker = async (_, { ticker, limit }) => {
  const [res1, res2, news] = await Promise.all([
    fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`),
    fetch(`https://finnhub.io/api/v1/stock/profile?symbol=${ticker}&token=${process.env.MY_FINNHUB_TOKEN}`),
    google(ticker.toUpperCase(), limit),
  ])
  const [data1, data2] = await Promise.all([
    res1.json(),
    res2.json(),
  ])
  const { name, weburl } = data2
  return {
    ticker,
    name,
    weburl,
    open: data1.o.toFixed(2),
    high: data1.h.toFixed(2),
    low: data1.l.toFixed(2),
    price: data1.c.toFixed(2),
    change: (((data1.c - data1.pc) / data1.pc) * 100).toFixed(2),
    news,
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

// const handler = server.createHandler()
// console.log(handler)

// exports.handler = authorize(handler)

exports.handler = server.createHandler()