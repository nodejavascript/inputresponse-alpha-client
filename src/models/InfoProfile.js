import React from 'react'

import CoreCodeComment from '../components/CoreCodeComment'
import { Space } from 'antd'

const InfoProfile = ({ record }) => {
  if (!record) return null

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>

      <CoreCodeComment code='Your googleId and token are used to save your graphs' />

    </Space>
  )
}

export default InfoProfile
