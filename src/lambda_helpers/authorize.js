export default (user, callback) => {
  if (!user) {
    return {
      statusCode: 400,
      body: 'Unauthorized'
    }
  }
  return callback(user)
}