import React, { useEffect } from 'react'
import { gql, useLazyQuery, useReactiveVar } from '@apollo/client'
import { memoryConnected } from '../lib/apolloReactiveVars'

import { message } from 'antd'
// const HEALTH_CHECK_RETRY_SECONDS = 2

const HEALTH_CHECK = gql`
  query {
    healthCheck
  }
`
const MSGID = 1

const HealthCheck = ({ children }) => {
  const isConnected = useReactiveVar(memoryConnected)

  const [healthCheck, { data, loading, error, networkStatus }] = useLazyQuery(HEALTH_CHECK, {
    notifyOnNetworkStatusChange: true
  })

  useEffect(() => {
    if (!isConnected) return healthCheck()
    if (isConnected === 'refresh') return memoryConnected(false)
  }, [isConnected, healthCheck])

  useEffect(() => {
    if (loading) return message.loading('API HealthCheck...', MSGID)

    if (error) {
      message.error(error?.message, MSGID)
      return memoryConnected(false)
    }

    if (data) memoryConnected(true)
  }, [data, loading, error, networkStatus])

  return (
    <>
      {children}
    </>
  )
}

export default HealthCheck
