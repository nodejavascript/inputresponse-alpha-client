import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { CORE_QUERY_FIELDS } from '../lib'

import CoreTable from '../components/CoreTable'
import ModelSize from '../components/ModelSize'
import CellFormat from '../components/table/CellFormat'

import { Badge } from 'antd'

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
  let topRow = <Badge status='processing' text='Trained' />

  if (!record?.memoryNeuralNetwork) topRow = <Badge status='default' text='Offline' />
  if (!record?.memoryNeuralNetwork?.samplesPerSecond) topRow = <Badge status='error' text='Not trained' />

  return (
    <CellFormat
      topRow={topRow}
      bottomRow={<ModelSize record={record} />}
    />
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
      sorter: (a, b) => a?.memoryNeuralNetwork && a.memoryNeuralNetwork.localeCompare(b.memoryNeuralNetwork)
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
