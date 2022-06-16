import React from 'react'

import { green } from '@ant-design/colors'
import { Space, Progress } from 'antd'

const ModelSize = ({ record }) => {
  if (record?.modelSize >= 0) {
    return (
      <Space>
        {record.modelSize} samples
        <Progress percent={50} steps={5} size='small' strokeColor={green[6]} showInfo />
      </Space>
    )
  }
  return null
}

export default ModelSize
