import authorize from './utils/authorize'
import fetch from 'node-fetch'
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const url = `https://graphql.fauna.com/graphql`

const graphql = async (event) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.FAUNADB_SERVER_SECRET}`,
      },
      body: event.body,
    })
    const data = await response.json()
    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  } catch(e) {
    console.error(e)
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: 'bad request'
      })
    }
  }
}

exports.handler = authorize(graphql)