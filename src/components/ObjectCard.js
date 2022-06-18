import React from 'react'
import { useLocation } from 'react-router-dom'

import { returnTitle } from '../layout/AppRouter'

import Buttons from './Buttons'
import ErrorQuery from './ErrorQuery'
import CoreDescriptions from './CoreDescriptions'

import { Card } from 'antd'

const ObjectCard = ({ record, buttons, loading, error }) => {
  const { pathname } = useLocation()
  const title = returnTitle(pathname)

  if (error) return <ErrorQuery error={error} />

  return (
    <Card
      title={title}
      loading={loading}
      extra={<Buttons buttons={buttons} />}
    >
      <CoreDescriptions record={record} />
    </Card>
  )
}

export default ObjectCard
