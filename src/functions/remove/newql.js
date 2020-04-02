import authorize from './utils/authorize'
import { ApolloServer, gql } from 'apollo-server-lambda'
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
import fetch from 'node-fetch'


import { Companies, Updates } from './utils/dynamo'

const typeDefs = gql`
  type Market {
    open: String!
    high: String!
    low: String!
    price: String!
    change: String!
  }
  type Company {
    ticker: String!
    # name: String!
    logo: String
    # market: Market!
  }
  input CompanyInput {
    ticker: String
    logo: String
  }
  type Update {
    company: Company!
    title: String!
    link: String
    date: String!
  }
  input UpdateInput {
    ticker: String
    title: String
    link: String
    date: String
  }
  type Query {
    loadData(name: String!): [Company!]
    allUpdates: [Update!]!
    companyByTicker(ticker: String!): Company
    updatesByTicker(ticker: String!): [Update!]!
  }
  type Mutation {
    createCompany(CompanyInput: CompanyInput!): String
    updateCompany(CompanyInput: CompanyInput!): Company
    createUpdate(UpdateInput: UpdateInput!): Update
  }
`

const loadData = async (root, args, { user }) => {
  console.log(user)
  try {
    const companies = await Companies.scan().exec().promise()
    return companies[0].Items.map(item => item.attrs)
  } catch(e) {
    console.error(e)
    return null
  }
}

const createCompany = async (root, { CompanyInput }) => {
  try {
    const company = await Companies.create({
      ticker: CompanyInput.ticker.toUpperCase(),
      logo: CompanyInput.logo,
    })
    return company.attrs
  } catch(e) {
    console.error(e)
    return null
  }
}

const allUpdates = async () => {
  try {
    const updates = await Updates.scan().exec().promise()
    return updates[0].Items.map(item => ({ ...item.attrs, company: { ticker: item.attrs.ticker }}))
  } catch(e) {
    console.error(e)
    return []
  }
}

const companyByTicker = async (root, { ticker }) => {
  try {
    let company = await Companies.scan().where('ticker').equals(ticker.toUpperCase()).exec().promise()
    if (company[0].Items.length === 0) {
      // create new company if it does not currently exist
      company = await Companies.create({
        ticker: ticker.toUpperCase(),
      })
    } else {
      company = company[0].Items[0]
    }
    return company.attrs
  } catch(e) {
    console.error(e)
    return null
  }
}

const updatesByTicker = async (root, { ticker }) => {
  try {
    const updates = await Updates.scan().where('ticker').equals(ticker.toUpperCase()).exec().promise()
    return updates[0].Items.map(item => ({ ...item.attrs, company: { ticker: item.attrs.ticker }}))
  } catch(e) {
    console.error(e)
    return []
  }
}

const updateCompany = async (root, { CompanyInput }) => {
  try {
    let company = await Companies.scan().where('ticker').equals(CompanyInput.ticker.toUpperCase()).exec().promise()
    company = company[0].Items.map(item => item.attrs)
    company = company[0]
    const update = await Companies.update({ id: company.id, ticker: company.ticker, logo: CompanyInput.logo })
    return {
      ...update.attrs,
      company: {
        ticker: CompanyInput.ticker.toUpperCase(),
      },
    }
  } catch(e) {
    console.error(e)
    return null
  }
}

const createUpdate = async (root, { UpdateInput }) => {
  try {
    const update = await Updates.create({
      ticker: UpdateInput.ticker.toUpperCase(),
      title: UpdateInput.title,
      date: UpdateInput.date,
      link: UpdateInput.link,
    })
    return update.attrs
  } catch(e) {
    console.error(e)
    return null
  }
}

const resolvers = {
  Query: {
    loadData,
    allUpdates,
    companyByTicker,
    updatesByTicker,
  },
  Mutation: {
    createCompany,
    updateCompany,
    createUpdate,
  },
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