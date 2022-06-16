import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { CORE_QUERY_FIELDS } from '../lib'

import CoreTable from '../components/CoreTable'

import { Space, Badge } from 'antd'

export const QUERY_NEURAL_NETWORKS = gql`
  query queryNeuralNetworks {
    neuralNetworks {
      ${CORE_QUERY_FIELDS}

      apiKey
      apiKeyCreated
      apiKeyExpires
      apiKeyExpired

      apiKeyCreatedAgo
      apiKeyCreatedUnix
      apiKeyExpiresAgo
      apiKeyExpiresUnix

      modelSize

      memoryNeuralNetwork {
        modelSize
        trainingMs
        samplesPerSecond
        createdAt
      }
    }
  }
`

export const ModelTrained = ({ record }) => {
  if (!record?.memoryNeuralNetwork) return <Badge status='default' text='Offline' />
  if (!record?.memoryNeuralNetwork.samplesPerSecond) return <Badge status='error' text='Not trained' />
  return (
    <Space size='small'>
      <Badge status='processing' text='Trained' />
      @ {record.memoryNeuralNetwork.samplesPerSecond.toFixed(2)} samples / s
    </Space>
  )
}

const ApiKeyExpiry = ({ record }) => {
  if (record?.apiKeyExpired) return <Badge status='error' text='Invalid' />

  return <Badge status='success' text='Valid' />
}

const ListNeuralNetworks = ({ paths }) => {
  const { loading, data, error } = useQuery(QUERY_NEURAL_NETWORKS)

  const specificColumns = [
    {
      title: 'Neural network',
      key: 'memoryNeuralNetwork',
      render: record => <ModelTrained record={record} />,
      sorter: (a, b) => a.memoryNeuralNetwork && a.memoryNeuralNetwork.localeCompare(b?.memoryNeuralNetwork)
    },
    {
      title: 'API key',
      key: 'apiKey',
      render: record => <ApiKeyExpiry record={record} />,
      sorter: (a, b) => a.apiKeyExpiresUnix && a.apiKeyExpiresUnix.localeCompare(b?.apiKeyExpiresUnix)
    }
  ]

  const dataSource = data?.neuralNetworks

  return (
    <CoreTable
      dataSource={dataSource}
      specificColumns={specificColumns}
      loading={loading}
      error={error}
      paths={paths}
    />
  )
}

export default ListNeuralNetworks
