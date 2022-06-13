import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { CORE_QUERY_FIELDS } from '../lib'

import CoreTable from '../components/CoreTable'

const QUERY_MODEL_SAMPLES = gql`
  query queryModelSamples {
    modelSamples {
      ${CORE_QUERY_FIELDS}

      samplingclientId
      input: inputDisplay
      output: outputDisplay
      neuralNetwork {
        id
        name
      }
      samplingClient {
        id
        name
      }
    }
  }
`
const ListModelSamples = ({ paths }) => {
  const { loading, data, error } = useQuery(QUERY_MODEL_SAMPLES)

  const specificColumns = [
    {
      title: 'Neural Network',
      key: 'neuralNetwork.name',
      render: record => record?.neuralNetwork.name,
      sorter: (a, b) => a.neuralNetwork.name && a.neuralNetwork.name.localeCompare(b?.neuralNetwork.name)
    },
    {
      title: 'Sampling Client',
      key: 'samplingClient.name',
      render: record => record?.samplingClient.name,
      sorter: (a, b) => a.samplingClient.name && a.samplingClient.name.localeCompare(b?.samplingClient.name)
    },
    {
      title: 'input',
      key: 'input',
      dataIndex: 'input',
      sorter: (a, b) => a.input && a.input.localeCompare(b?.input)
    },
    {
      title: 'output',
      key: 'output',
      dataIndex: 'output',
      sorter: (a, b) => a.output && a.output.localeCompare(b?.output)
    }
  ]

  const dataSource = data?.modelSamples

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

export default ListModelSamples
