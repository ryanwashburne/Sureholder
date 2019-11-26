import AWS from 'aws-sdk'
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const { MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME } = process.env

AWS.config.region = 'us-west-2'
const s3 = new AWS.S3({
  signatureVersion: 'v4',
  credentials: new AWS.Credentials(MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY)
})

const getSignedUrl = async (key, type) => {
  const s3Params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
    ContentType: type,
    ACL: 'public-read', /* Note: change if files are NOT public */
    /* Optionally add additional data
      Metadata: {
        foo: 'bar',
        lol: 'hi'
      }
    */
  }
  try {
    return s3.getSignedUrl('putObject', s3Params)
  } catch(e) {
    throw e
  }
}

export {
  getSignedUrl,
}