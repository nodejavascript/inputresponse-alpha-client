import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { client } from './lib'

import './App.css'

import HealthCheck from './lib/HealthCheck'
import AppRouter from './layout/AppRouter'

const App = () => {
  return (
    <ApolloProvider client={client()}>
      <HealthCheck>
        <AppRouter />
      </HealthCheck>
    </ApolloProvider>
  )
}

export default App
