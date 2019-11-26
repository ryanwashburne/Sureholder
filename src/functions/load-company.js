import { authorize } from '../lambda_helpers'
import { companyByTicker } from './utils/faunadb'
import fetch from 'node-fetch'

const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=`

export const loadCompany = async (event) => {
  try {
    const { queryStringParameters } = event
    const { company } = queryStringParameters

    let [ companyData, marketData ] = await Promise.all([
      companyByTicker(company.toUpperCase()),
      fetch(`${url}${company}`),
    ])
    if (!companyData) {
      companyData = {} // if null, become object
    } else {
      companyData = companyData.data
    }
    marketData = await marketData.json()
    if (!marketData['Status'] || marketData['Status'] !== 'SUCCESS') throw new Error() // if invalid ticker

    return {
      statusCode: 200,
      body: JSON.stringify({
        companyData,
        marketData,
      })
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