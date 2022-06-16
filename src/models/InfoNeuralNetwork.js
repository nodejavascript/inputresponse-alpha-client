import React from 'react'

import NeuralNetworkController from './NeuralNetworkController'
import CoreCopyToClipboard from '../components/CoreCopyToClipboard'
import { ModelTrained } from '../routes/ListNeuralNetworks'
import RequestNewApiKey from '../components/RequestNewApiKey'

import { Space, Alert, Col } from 'antd'

const InfoNeuralNetwork = ({ record }) => {
  if (!record) return null

  const { memoryNeuralNetwork } = record

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>
      <Col>
        Model: <ModelTrained record={record} />
      </Col>
      {memoryNeuralNetwork && <Alert banner type='success' message='Trained' />}

      {!memoryNeuralNetwork && <NeuralNetworkController record={record} />}

      <CoreCopyToClipboard field='apiKey' text={record?.apiKey} />
      <RequestNewApiKey record={record} />

    </Space>
  )
}

export default InfoNeuralNetwork
