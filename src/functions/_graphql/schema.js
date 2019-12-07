export default `
type Company {
  ticker: String!
  logo: String
}
type Update {
  company: Company!
  title: String!
  date: String!
  link: String
}
type Query {
  allCompanies: [Company!]
  allUpdates: [Update!]
  companyByTicker(ticker: String!): Company
}
`