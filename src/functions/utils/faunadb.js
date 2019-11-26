import faunadb from 'faunadb'
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

const companyByTicker = async (ticker) => {
  try {
    return await client.query(
      q.Get(
        q.Match(
          q.Index("company_by_ticker"),
          ticker
        )
      )
    )
  } catch(e) {
    return null
  }
}

const updateCompany = async (companyRef, data) => {
  try {
    return await client.query(
      q.Update(
        q.Ref(companyRef),
        { data }
      )
    )
  } catch(e) {
    throw e
  }
}

const createCompany = async (data) => {
  try {
    return await client.query(
      q.Create(
        q.Collection('companies'),
        { data }
      )
    )
  } catch(e) {
    throw e
  }
}

const updatesByTickers = async (tickers) => {
  try {
    return await client.query(
      q.Map(
        q.Paginate(
          q.Union(
            tickers.map((ticker) => (
              q.Match(
                q.Index('updates_by_ticker'),
                ticker.toUpperCase()
              )
            )),
          ),
        ),
        ref => q.Get(ref)
      )
    )
  } catch(e) {
    return null
  }
}

export {
  companyByTicker,
  updateCompany,
  createCompany,
  updatesByTickers,
}