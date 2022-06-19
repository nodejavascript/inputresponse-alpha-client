import React, { useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'

import ErrorMessage from './ErrorMessage'

import { Space, Button, message } from 'antd'

export const TRAIN_NEURAL_NETWORK = gql`
  mutation trainNeuralNetworkMutation ($trainNeuralNetworkInput: TrainNeuralNetworkInput!) {
    trainNeuralNetwork (trainNeuralNetworkInput: $trainNeuralNetworkInput) {
      id
      lastTrainingHistory {
        iterations
        samplesPerSecond
      }
    }
  }
`

const TrainNeuralNetwork = ({ record }) => {
  const { id: neuralnetworkId } = record

  const [trainNeuralNetworkMutation, { data, loading, error }] = useMutation(TRAIN_NEURAL_NETWORK)

  useEffect(() => {
    if (!data?.trainNeuralNetwork?.lastTrainingHistory) return
    const { iterations, samplesPerSecond } = data.trainNeuralNetwork.lastTrainingHistory
    return message.success(`Model trained with ${iterations} iterations, ${samplesPerSecond} samples/second.`, [5])
  }, [data])

  return (
    <Space direction='vertical' size='middle' style={{ width: '100%' }}>
      <Button
        type='secondary'
        loading={loading}
        onClick={() => trainNeuralNetworkMutation({
          variables: {
            trainNeuralNetworkInput: { neuralnetworkId }
          }
        })}
      >
        Train Model
      </Button>

      <ErrorMessage error={error} />
    </Space>
  )
}

export default TrainNeuralNetwork
