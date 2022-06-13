import React from 'react'

import { gql, useQuery } from '@apollo/client'

import InfoAbout from '../models/InfoAbout'
import CoreCard from '../components/CoreCard'

const QUERY_ABOUT = gql`
  query queryAbout {
    about {
      name
      version
      env
      host
      origin
      userAgent
    }
  }
`

const About = () => {
  const { loading, data, error } = useQuery(QUERY_ABOUT)

  const record = data?.about

  return (
    <CoreCard
      info={<InfoAbout record={record} />}
      record={record}
      loading={loading}
      error={error}
    />
  )
}

export default About
