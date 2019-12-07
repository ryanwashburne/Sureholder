import authorize from './utils/authorize'
import { companyByTicker, updateCompany } from './utils/faunadb'

export const updateLogo = async (event) => {
  try {
    const { ticker, type } = JSON.parse(event.body)
    const data = await companyByTicker(ticker.toUpperCase())
    const logo = `https://sureholder.s3-us-west-2.amazonaws.com/${ticker.toUpperCase()}.${type}`
    await updateCompany(data.ref, {
      logo,
    })
    return {
      statusCode: 200,
      body: 'ok',
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: e.message,
    }
  }
}

exports.handler = authorize(updateLogo)