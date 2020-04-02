const AWS = require('aws-sdk')
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const { MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME } = process.env

AWS.config.region = 'us-west-2'
const s3 = new AWS.S3({
  signatureVersion: 'v4',
  credentials: new AWS.Credentials(MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY)
})

module.exports.handler = async (event, context) => {
  const body = JSON.parse(event.body)

  const s3Params = {
    Bucket: S3_BUCKET_NAME,
    Key: 'tesla.png',
  }

  const obj = await s3.getObject(s3Params)
  console.log(obj)
  return {
    statusCode: 200,
    body: 'ok'
  }
}