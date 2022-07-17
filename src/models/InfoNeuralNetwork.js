import React, { useState, useEffect } from 'react'
import { gql, useSubscription } from '@apollo/client'

import CoreCodeComment from '../components/CoreCodeComment'
import CoreCopyToClipboard from '../components/CoreCopyToClipboard'
import ModelSize from '../components/ModelSize'
import RequestNewApiKey from '../components/RequestNewApiKey'
import SimpleLink from '../components/SimpleLink'
import TrainNeuralNetwork from '../components/TrainNeuralNetwork'
import ModelTrained from '../components/ModelTrained'

import StatusBanner from '../components/StatusBanner'

import { Space, Col } from 'antd'

const SUBSCRIPTION_SENSOR_DATA_INSERTED = gql`
  subscription subscribeNeuralNetworkTrainingSubscription ($subscribeNeuralNetworkInput: SubscribeNeuralNetworkInput!) {
    subscribeNeuralNetworkTraining (subscribeNeuralNetworkInput: $subscribeNeuralNetworkInput) {
      modelSize

      memoryNeuralNetwork {
        isTrained
      }

      lastTrainingHistory {
        trainingMs
        samplesPerSecond
      }
    }
  }
`

const InfoNeuralNetwork = ({ record }) => {
  const { id: neuralnetworkId } = record
  const { data: subscription } = useSubscription(SUBSCRIPTION_SENSOR_DATA_INSERTED, { variables: { subscribeNeuralNetworkInput: { neuralnetworkId } } })

  const [subRecord, setSubRecord] = useState()

  useEffect(() => {
    if (subscription?.subscribeNeuralNetworkTraining) return setSubRecord(subscription.subscribeNeuralNetworkTraining)
  }, [subscription, setSubRecord])

  useEffect(() => {
    if (record) return setSubRecord(record)
  }, [record, setSubRecord])

  if (!record) return null

  const { apiKey } = record

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

      <StatusBanner
        type='info'
        message={
          <Space size='large'>
            <CoreCopyToClipboard field='apiKey' text={record?.apiKey} />
            <RequestNewApiKey record={record} />
          </Space>
        }
      />

      <Col>
        Model: <ModelTrained record={subRecord} />
      </Col>

      <Col>
        Model size: <ModelSize record={subRecord} />
      </Col>

    </Space>
  )
}

export default InfoNeuralNetwork
