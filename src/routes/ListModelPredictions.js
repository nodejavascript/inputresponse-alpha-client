import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { CORE_QUERY_FIELDS } from '../lib'

import CoreTable from '../components/CoreTable'
import CoreCodeComment from '../components/CoreCodeComment'
import CellFormat from '../components/table/CellFormat'

export const PredictionFirstGuess = ({ record }) => (
  <CellFormat
    topRow={<>guess {record?.guesses[0]?.guess}</>}
    bottomRow={<>confidence {record?.guesses[0]?.confidence}</>}
  />
)

const QUERY_MODEL_PREDICTIONS = gql`
  query queryModelPredictions {
    modelPredictions {
      ${CORE_QUERY_FIELDS}

      samplingclientId
      input: inputDisplay

      guesses {
        guess
        confidence
      }

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
const ListModelPredictions = ({ paths }) => {
  const { loading, data, error } = useQuery(QUERY_MODEL_PREDICTIONS)

  const specificColumns = [
    {
      title: 'Neural Network',
      key: 'neuralNetwork.name',
      render: record => record?.neuralNetwork?.name,
      sorter: (a, b) => a?.neuralNetwork?.name && a.neuralNetwork.name.localeCompare(b.neuralNetwork.name)
    },
    {
      title: 'Client',
      key: 'samplingClient.name',
      render: record => record?.samplingClient?.name,
      sorter: (a, b) => a?.samplingClient?.name && a.samplingClient.name.localeCompare(b.samplingClient.name)
    },
    {
      title: 'input',
      key: 'input',
      render: record => <CoreCodeComment code={record?.input} />,
      sorter: (a, b) => a?.input && a.input.localeCompare(b.input)
    },
    {
      title: 'guess',
      key: 'guess',
      render: record => <PredictionFirstGuess record={record} />,
      sorter: (a, b) => a?.output && a.output.localeCompare(b.output)
    }
  ]

  const dataSource = data?.modelPredictions

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

export default ListModelPredictions
