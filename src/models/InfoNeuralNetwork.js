import React from 'react'

import NeuralNetworkController from './NeuralNetworkController'
import CoreCopyToClipboard from '../components/CoreCopyToClipboard'

import { Space, Alert, Col, Card, Row } from 'antd'

const InfoNeuralNetwork = ({ record }) => {
  if (!record) return null

  const { memoryNeuralNetwork } = record
  console.log('memoryNeuralNetwork', memoryNeuralNetwork)
  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>

      {memoryNeuralNetwork && <Alert banner type='success' message='Trained' />}

      {!memoryNeuralNetwork && <NeuralNetworkController record={record} />}

      <Row justify='center'>
        <Card
          hoverable
          size='small'
          bordered={false}
        >
          <Col>
            <CoreCopyToClipboard field='apiKey' text={record?.apiKey} />
          </Col>
        </Card>
      </Row>

    </Space>
  )
}

export default InfoNeuralNetwork
