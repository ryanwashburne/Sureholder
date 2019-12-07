export default (child) => {
  return async (event, context, other) => {
    if (!context || !context.clientContext || !context.clientContext.user) {
      return {
        statusCode: 400,
        body: 'Unauthorized'
      }
    }
    return child(event, context, other)
  }
}