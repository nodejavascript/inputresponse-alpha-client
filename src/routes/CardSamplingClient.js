import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import { CORE_QUERY_FIELDS } from '../lib'

import UpdateSamplingClient from './UpdateSamplingClient'
import CoreCard from '../components/CoreCard'

export const QUERY_SAMPLING_CLIENT = gql`
  query querySamplingClient ($querySamplingClientInput: QuerySamplingClientInput!) {
    samplingClient (querySamplingClientInput: $querySamplingClientInput) {
      ${CORE_QUERY_FIELDS}

      userAgent

      modelSize
    }
  }
`

const CardSamplingClient = ({ paths }) => {
  const { samplingclientId } = useParams()

  const { loading, data, error } = useQuery(QUERY_SAMPLING_CLIENT, { variables: { querySamplingClientInput: { samplingclientId } } })

  const record = data?.samplingClient

  return (
    <CoreCard
      record={record}
      loading={loading}
      error={error}
      paths={paths}
      updateForm={<UpdateSamplingClient paths={paths} hideTitle={1} />}
    />
  )
}

export default CardSamplingClient
