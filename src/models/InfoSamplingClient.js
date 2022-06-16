import React from 'react'

import CoreCodeComment from '../components/CoreCodeComment'
import ModelSize from '../components/ModelSize'
import SimpleLink from '../components/SimpleLink'

import { Space, Col } from 'antd'

const InfoSamplingClient = ({ record }) => {
  if (!record?.id) return null

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>

      <CoreCodeComment code='Will show how this Client contributes fitness, and resulting AI confidence' />

      <SimpleLink
        key='addSampleFromSamplingClient'
        type='secondary'
        to={`/insertmodelsample?samplingclientId=${record.id}`}
        content='Add sample'
      />

      <Col>
        Model size: <ModelSize record={record} />
      </Col>

    </Space>
  )
}

export default InfoSamplingClient
