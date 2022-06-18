import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import { CORE_QUERY_FIELDS } from '../lib'

import UpdateModelPrediction from './UpdateModelPrediction'
import InfoModelPrediction from '../models/InfoModelPrediction'
import CoreCard from '../components/CoreCard'

export const QUERY_MODEL_PREDICTION = gql`
  query queryModelPrediction ($queryModelPredictionInput: QueryModelPredictionInput!) {
    modelPrediction (queryModelPredictionInput: $queryModelPredictionInput) {
      ${CORE_QUERY_FIELDS}

      neuralnetworkId
      samplingclientId
      input: inputDisplay
      output: outputDisplay

      neuralNetwork {
        ${CORE_QUERY_FIELDS}
      }
      samplingClient {
        ${CORE_QUERY_FIELDS}
      }
    }
  }
`

const CardModelPrediction = ({ paths }) => {
  const { modelpredictionId } = useParams()

  const { loading, data, error } = useQuery(QUERY_MODEL_PREDICTION, { variables: { queryModelPredictionInput: { modelpredictionId } } })

  const record = data?.modelPrediction

  return (
    <CoreCard
      info={<InfoModelPrediction record={record} />}
      record={record}
      loading={loading}
      error={error}
      paths={paths}
      updateForm={<UpdateModelPrediction paths={paths} hideTitle={1} />}
    />
  )
}

export default CardModelPrediction
