import React from 'react'

// import { green } from '@ant-design/colors'
import { Space } from 'antd'

const ModelSize = ({ record }) => {
  if (!record) return null
  const { modelSize, lastTrainingHistory } = record
  return (
    <Space size='small' wrap>
      <p>modelSize: {modelSize}</p>
      {lastTrainingHistory?.trainingMs && <p>trainingMs: {lastTrainingHistory?.trainingMs}</p>}
      {lastTrainingHistory?.samplesPerSecond && <p>samplesPerSecond: {lastTrainingHistory?.samplesPerSecond}</p>}
    </Space>
  )
}

export default ModelSize
