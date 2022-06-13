import React from 'react'
import { gql, useQuery } from '@apollo/client'

import { CORE_QUERY_FIELDS } from '../lib'

import UpdateProfile from './UpdateProfile'
import InfoProfile from '../models/InfoProfile'
import CoreCard from '../components/CoreCard'

export const QUERY_PROFILE = gql`
  query queryProfile {
    profile {
      ${CORE_QUERY_FIELDS}

      googleUserId
      neuralNetworkSize
      samplingClientSize
      userModelSize

      neuralNetworks {
        ${CORE_QUERY_FIELDS}
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

const CardProfile = ({ paths }) => {
  const { loading, data, error } = useQuery(QUERY_PROFILE)

  const record = data?.profile

  return (
    <CoreCard
      info={<InfoProfile record={record} />}
      record={record}
      loading={loading}
      error={error}
      paths={paths}
      updateForm={<UpdateProfile paths={paths} hideTitle={1} />}
    />
  )
}

export default CardProfile
