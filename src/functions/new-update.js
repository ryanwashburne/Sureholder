import { authorize } from '../lambda_helpers'
import { companyByTicker, updateCompany, createCompany } from './utils/faunadb'

export const newUpdate = async (event) => {
  try {
    const { ticker, title, date } = JSON.parse(event.body)
    const data = await companyByTicker(ticker)
    if (!data) { // if the company doesn't already exist
      await createCompany({
        ticker,
        updates: [
          {
            title,
            date,
          }
        ]
      })
    } else {
      const updates = data.data.updates
      updates.push({
        title,
        date,
      })
      await updateCompany(data.ref, {
        updates,
      })
    }
    return {
      statusCode: 200,
      body: 'ok'
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: e.message,
    }
  }
}

exports.handler = async (event, context) => authorize(context.clientContext.user, async () => newUpdate(event));