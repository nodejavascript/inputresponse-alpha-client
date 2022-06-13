import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import { CORE_QUERY_FIELDS } from '../lib'

import UpdateNeuralNetwork from './UpdateNeuralNetwork'
import InfoNeuralNetwork from '../models/InfoNeuralNetwork'
import CoreCard from '../components/CoreCard'

export const QUERY_NEURAL_NETWORK = gql`
  query queryNeuralNetwork ($queryNeuralNetworkInput: QueryNeuralNetworkInput!) {
    neuralNetwork (queryNeuralNetworkInput: $queryNeuralNetworkInput) {
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
        samplesPerSecond
      }

      lastTrainingHistory {

        modelSize
        trainingMs
        samplesPerSecond

        createdAtAgo
      }

      samplingClients {
        ${CORE_QUERY_FIELDS}
      }
      modelSamples {
        ${CORE_QUERY_FIELDS}
      }

    }
  }
`

const CardNeuralNetwork = ({ paths }) => {
  const { neuralnetworkId } = useParams()

  const { loading, data, error } = useQuery(QUERY_NEURAL_NETWORK, { variables: { queryNeuralNetworkInput: { neuralnetworkId } } })

  const record = data?.neuralNetwork

  return (
    <CoreCard
      info={<InfoNeuralNetwork record={record} />}
      record={record}
      loading={loading}
      error={error}
      paths={paths}
      updateForm={<UpdateNeuralNetwork paths={paths} hideTitle={1} />}
    />
  )
}

export default CardNeuralNetwork
