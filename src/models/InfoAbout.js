import React from 'react'

import NoConnection from '../components/NoConnection'
import CoreCodeComment from '../components/CoreCodeComment'
import { Space } from 'antd'

const InfoAbout = ({ record }) => {
  if (!record) return null

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>

      <CoreCodeComment code='connection statuses' />
      <NoConnection />

    </Space>
  )
}

export default InfoAbout
