export default (child) => {
  return (event, context, callback) => {
    if (!context?.clientContext?.user) {
      callback(null, {
        statusCode: 401,
        body: 'Unauthorized'
      })
    }
    child(event, context, callback)
  }
}