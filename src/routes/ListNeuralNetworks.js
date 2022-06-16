import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { CORE_QUERY_FIELDS } from '../lib'

import CoreTable from '../components/CoreTable'
import CellFormat from '../components/table/CellFormat'
import CoreCopyToClipboard from '../components/CoreCopyToClipboard'
import RequestNewApiKey from '../components/RequestNewApiKey'

import { green } from '@ant-design/colors'
import { Space, Badge, Progress } from 'antd'

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

const ModelSize = ({ record }) => {
  return (
    <Space size='small'>
      <Progress percent={50} steps={5} size='small' strokeColor={green[6]} showInfo={false} />
      {record.modelSize} samples
    </Space>
  )
}

const ModelTrained = ({ record }) => {
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
      render: record => (
        <CellFormat
          topRow={<ModelTrained record={record} />}
          bottomRow={<ModelSize record={record} />}
        />
      ),
      sorter: (a, b) => a.memoryNeuralNetwork && a.memoryNeuralNetwork.localeCompare(b?.memoryNeuralNetwork)
    },
    {
      title: 'API key',
      key: 'apiKey',
      render: record => (
        <CellFormat
          topRow={<ApiKeyExpiry record={record} />}
          bottomRow={<CoreCopyToClipboard field='apiKey' text={record?.apiKey} />}
        />
      ),
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
