import { getSignedUrl } from './utils/s3'

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body)
    const { fileName, fileType } = body

    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing fileName or fileType on body'
        })
      }
    }

    const uploadURL = await getSignedUrl(fileName, fileType)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadURL
      })
    }
  } catch(e) {
    console.error(e)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Bad Request'
      }),
    }
  }
}