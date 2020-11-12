import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: '/.netlify/functions/graphql',
})

function getToken() {
  try {
    return JSON.parse(localStorage.getItem('gotrue.user')).token.access_token
  } catch (e) {
    return null
  }
}

const authLink = setContext(async (_, { headers }) => {
  const token = getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})
