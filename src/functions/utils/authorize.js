export default (child) => {
  return async (event, context, callback) => {
    if (!context?.clientContext?.user) {
      return {
        statusCode: 401,
        body: 'Unauthorized'
      }
    }
    return child(event, context, callback)
  }
}