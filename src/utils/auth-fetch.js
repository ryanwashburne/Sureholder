import { useIdentityContext } from 'react-netlify-identity'

export default async (url, config = {}) => {
  console.log(useIdentityContext)
  const identity = useIdentityContext()
  console.log(identity)
  const { user } = identity
  console.log(user)
  try {
    return await fetch(url, {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${user.token.access_token}`,
      }
    })
  } catch(e) {
    throw e
  }
}