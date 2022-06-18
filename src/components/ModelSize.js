import React from 'react'

import { green } from '@ant-design/colors'
import { Space, Progress } from 'antd'

const ModelSize = ({ record }) => {
  return (
    <Space>
      {record.modelSize} samples
      <Progress percent={50} steps={5} size='small' strokeColor={green[6]} showInfo />
    </Space>
  )
}

export default ModelSize
