import React from 'react'

import CoreCodeComment from '../components/CoreCodeComment'
import CoreCopyToClipboard from '../components/CoreCopyToClipboard'
import ModelSize from '../components/ModelSize'
import RequestNewApiKey from '../components/RequestNewApiKey'
import SimpleLink from '../components/SimpleLink'
import TrainNeuralNetwork from '../components/TrainNeuralNetwork'

import { ModelTrained } from '../routes/ListNeuralNetworks'

import { Space, Alert, Col } from 'antd'

const InfoNeuralNetwork = ({ record }) => {
  if (!record) return null

  const { apiKey, modelSize } = record

  return (
    <Space direction='vertical' style={{ width: '100%' }}>

      <CoreCodeComment code='Will show who contributes to model, how much is fitness, how much is requesting intelligence.' />

      <Space align='start'>
        <SimpleLink
          key='addSampleFromNeuralNetwork'
          type='secondary'
          to={`/insertmodelsample?apiKey=${apiKey}`}
          content='Add sample'
        />
        <TrainNeuralNetwork record={record} />
        <SimpleLink
          key='requestPredictionFromNeuralNetwork'
          type='secondary'
          to={`/insertmodelprediction?apiKey=${apiKey}`}
          content='Request prediction'
        />
      </Space>

      <ModelSizeWarning apiKey={apiKey} modelSize={modelSize} />

      <Col>
        Model: <ModelTrained record={record} />
      </Col>

      <Col>
        Model size: <ModelSize record={record} />
      </Col>

      <CoreCopyToClipboard field='apiKey' text={record?.apiKey} />
      <RequestNewApiKey record={record} />

    </Space>
  )
}

export default InfoNeuralNetwork

const ModelSizeWarning = ({ modelSize }) => {
  if (modelSize) return null
  return (
    <Alert
      banner
      type='warning'
      message={(
        <>
          A minimum of one sample is required to train a Model.
        </>
      )}
    />
  )
}
