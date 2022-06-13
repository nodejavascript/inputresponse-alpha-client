import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import { CORE_QUERY_FIELDS } from '../lib'

import UpdateModelSample from './UpdateModelSample'
import CoreCard from '../components/CoreCard'

export const QUERY_MODEL_SAMPLE = gql`
  query queryModelSample ($queryModelSampleInput: QueryModelSampleInput!) {
    modelSample (queryModelSampleInput: $queryModelSampleInput) {
      ${CORE_QUERY_FIELDS}

      neuralnetworkId
      samplingclientId
      input: inputDisplay
      output: outputDisplay
    }
  }
`

const CardModelSample = ({ paths }) => {
  const { modelsampleId } = useParams()

  const { loading, data, error } = useQuery(QUERY_MODEL_SAMPLE, { variables: { queryModelSampleInput: { modelsampleId } } })

  const record = data?.modelSample

  return (
    <CoreCard
      record={record}
      loading={loading}
      error={error}
      paths={paths}
      updateForm={<UpdateModelSample paths={paths} hideTitle={1} />}
    />
  )
}

export default CardModelSample
