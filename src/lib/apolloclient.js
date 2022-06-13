import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from
} from '@apollo/client'

import { onError } from '@apollo/client/link/error'

import { memoryUser } from './apolloReactiveVars'

const { REACT_APP_API_ENDPOINT } = process.env

const errorLink = onError(args => {
  const { graphQLErrors, networkError, operation, forward } = args

  if (graphQLErrors) {
    graphQLErrors.forEach(err => {
      if (err) console.log('GraphQL err', JSON.stringify(err, null, 4))

      const stacktrace = err?.extensions?.exception?.stacktrace
      if (stacktrace) console.log('stacktrace', stacktrace)
    })
  }

  if (networkError) {
    if (networkError) console.log('networkError err', JSON.stringify(networkError, null, 4))
  }

  return forward(operation)
})

const setHeaders = new ApolloLink((operation, forward) => {
  const user = () => memoryUser()

  const clientRequest = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user()?.tokenId || 'null'}`
  }

  operation.setContext(({ headers }) => ({
    headers: {
      ...headers,
      ...clientRequest
    }
  }))

  return forward(operation)
})

const httpLink = new HttpLink({
  uri: REACT_APP_API_ENDPOINT
})

// https://shinesolutions.com/2021/06/30/automatically-handling-apollo-client-errors-in-your-react-ui/
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  },
  mutate: {
    errorPolicy: 'all'
  }
}

export const client = () => {
  const client = new ApolloClient({
    link: from([setHeaders, errorLink, httpLink]),
    cache: new InMemoryCache(),
    credentials: 'include',
    defaultOptions
  })
  return client
}
