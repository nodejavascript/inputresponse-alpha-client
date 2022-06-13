import React from 'react'

import CoreCodeComment from '../components/CoreCodeComment'
import { Space } from 'antd'

const InfoSamplingClient = ({ record }) => {
  if (!record) return null

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>

      <CoreCodeComment code='Will show how this Client contributes fitness, and resulting AI confidence' />

    </Space>
  )
}

export default InfoSamplingClient
