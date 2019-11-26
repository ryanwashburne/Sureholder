import { authorize } from '../lambda_helpers'
import { updatesByTickers } from './utils/faunadb'

export const loadCompany = async (event) => {
  try {
    const { queryStringParameters } = event
    const { ticker } = queryStringParameters
    
    const tickers = ticker.split(',')
    
    const { data } = await updatesByTickers(tickers.map((ticker) => ticker.toUpperCase()))
    let flat = data.map(({ data })=> data)

    return {
      statusCode: 200,
      body: JSON.stringify(flat)
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: e.message,
    }
  }
}

exports.handler = async (event, context) => authorize(context.clientContext.user, async () => loadCompany(event));