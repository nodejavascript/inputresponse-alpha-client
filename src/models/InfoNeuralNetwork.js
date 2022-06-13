import React from 'react'

import NeuralNetworkController from './NeuralNetworkController'
import CoreCopyToClipboard from '../components/CoreCopyToClipboard'

import { Space, Alert } from 'antd'

const InfoNeuralNetwork = ({ record }) => {
  if (!record) return null

  const { apiKey, memoryNeuralNetwork } = record

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>

      {memoryNeuralNetwork && <Alert banner type='success' message='Trained' />}

      {!memoryNeuralNetwork && <NeuralNetworkController record={record} />}

      <CoreCopyToClipboard
        field='apiKey'
        text={apiKey}
      />

    </Space>
  )
}

export default InfoNeuralNetwork
