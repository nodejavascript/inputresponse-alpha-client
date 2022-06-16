import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { CORE_QUERY_FIELDS } from '../lib'

import CoreTable from '../components/CoreTable'

const QUERY_SAMPLING_CLIENTS = gql`
  query querySamplingClients {
    samplingClients {
      ${CORE_QUERY_FIELDS}

      userAgent

      modelSize
    }
  }
`

const ListSamplingClients = ({ paths }) => {
  const { loading, data, error } = useQuery(QUERY_SAMPLING_CLIENTS)

  const dataSource = data?.samplingClients

  return (
    <CoreTable
      dataSource={dataSource}
      loading={loading}
      error={error}
      paths={paths}
    />
  )
}

export default ListSamplingClients
