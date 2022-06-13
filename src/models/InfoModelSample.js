import React from 'react'

import CoreCodeComment from '../components/CoreCodeComment'
import { Space } from 'antd'

const InfoModelSample = ({ record }) => {
  if (!record) return null

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>

      <CoreCodeComment code='Payloads can be posted to API and you can do it here too. Neural Network and Client Ids are immutable. Samples can be disabled or archived.' />

    </Space>
  )
}

export default InfoModelSample
