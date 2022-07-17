import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { CORE_QUERY_FIELDS } from '../lib'

import CoreTable from '../components/CoreTable'
import ModelTrained from '../components/ModelTrained'

import { Badge } from 'antd'

const QUERY_NEURAL_NETWORKS = gql`
  query queryNeuralNetworks {
    neuralNetworks {
      ${CORE_QUERY_FIELDS}

      apiKeyExpired
      apiKeyExpiresUnix

      modelSize

      memoryNeuralNetwork {
        isTrained
      }

      lastTrainingHistory {
        trainingMs
        samplesPerSecond
        updatedAtAgo
      }

    }
  }
`

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
      sorter: (a, b) => a.memoryNeuralNetwork?.isTrained.localeCompare(b.memoryNeuralNetwork?.isTrained)
    },
    {
      title: 'API key',
      key: 'apiKey',
      render: record => <ApiKeyExpiry record={record} />,
      sorter: (a, b) => a?.apiKeyExpiresUnix && a.apiKeyExpiresUnix.localeCompare(b.apiKeyExpiresUnix)
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
