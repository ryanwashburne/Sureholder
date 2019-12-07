import authorize from './utils/authorize'
import { companyByTicker } from './utils/faunadb'
import fetch from 'node-fetch'

const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=`

const loadCompany = async (event) => {
  try {
    const { queryStringParameters } = event
    const { ticker } = queryStringParameters
    const response = await fetch(`${url}${ticker}`)
    const data = await response.json()
    if (!data['Status'] || data['Status'] !== 'SUCCESS') throw new Error() // if invalid ticker

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      }
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: e.message,
    }
  }
}

exports.handler = authorize(loadCompany)