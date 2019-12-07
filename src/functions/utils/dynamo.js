import dynamo from 'dynamodb'
import Joi from '@hapi/joi'

require('dotenv').config()
dynamo.AWS.config.update({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
})

export const Companies = dynamo.define('Companies', {
  hashKey: 'id',
  rangeKey: 'ticker',
  timestamps: true,
  schema: {
    id: dynamo.types.uuid(),
    ticker: Joi.string().required(),
    logo: Joi.string().uri(),
  },
  tableName: 'Companies',
})

export const Updates = dynamo.define('Updates', {
  hashKey: 'id',
  timestamps: true,
  schema: {
    id: dynamo.types.uuid(),
    ticker: Joi.string().required(),
    title: Joi.string().required(),
    link: Joi.string().allow('').uri(),
    date: Joi.date().required(),
  },
  tableName: 'Updates',
})

dynamo.createTables((err) => {
  if (err) {
    console.log('Error creating tables: ', err)
  } else {
    console.log('Tables has been created')
  }
})

export default dynamo