import { authorize } from '../lambda_helpers'

import fetch from "node-fetch";

const url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=`

export const hello = async (event) => {
  try {
    const { queryStringParameters } = event
    const { company } = queryStringParameters
    const raw = await fetch(`${url}${company}`)
    const data = await raw.json()
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: e.message,
    }
  }
}

exports.handler = async (event, context) => authorize(context.clientContext.user, async () => hello(event));