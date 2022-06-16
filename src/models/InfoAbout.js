import React from 'react'

import ApiConnection from '../components/ApiConnection'
import { Space } from 'antd'

const InfoAbout = ({ record }) => {
  if (!record) return null

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>

      <ApiConnection />

    </Space>
  )
}

export default InfoAbout
