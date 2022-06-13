import React, { useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'

import ErrorMessage from '../components/ErrorMessage'
import SimpleLink from '../components/SimpleLink'

import { Space, Row, Col, Button, Alert, message } from 'antd'

const TRAIN_NEURAL_NETWORK = gql`
  mutation trainNeuralNetworkMutation ($trainNeuralNetworkInput: TrainNeuralNetworkInput!) {
    trainNeuralNetwork (trainNeuralNetworkInput: $trainNeuralNetworkInput) {
      id
    }
  }
`

const ModelSize = ({ modelSize }) => {
  if (!modelSize) return null
  return (
    <>
      Train your model with {modelSize} samples.
    </>
  )
}

const ModelSizeWarning = ({ apiKey, modelSize }) => {
  if (modelSize) return null
  return (
    <Alert
      banner
      type='warning'
      message={(
        <>
          A minimum of
          <SimpleLink key='addFirstSample' type='link' to={`/insertmodelsample?apiKey=${apiKey}`} content='one sample is needed' style={{ padding: 4 }} />
          to create a Model.
        </>
      )}
    />
  )
}

const ButtonTrainNeuralNetwork = ({ loading, neuralnetworkId, onClick }) => {
  return (
    <Button
      type='primary'
      size='large'
      loading={loading}
      onClick={onClick}
    >
      Train Neural Network
    </Button>
  )
}

const NeuralNetworkController = ({ record }) => {
  const { id: neuralnetworkId, apiKey, modelSize } = record

  const [trainNeuralNetworkMutation, { data, loading, error }] = useMutation(TRAIN_NEURAL_NETWORK)

  useEffect(() => {
    if (!data?.trainNeuralNetwork) return
    return message.info('TRAINED')
  }, [data])

  return (
    <Space direction='vertical' size='middle' style={{ width: '100%' }}>

      <ModelSizeWarning apiKey={apiKey} modelSize={modelSize} />

      <ModelSize modelSize={modelSize} />

      <Row justify='center'>
        <Col>
          <ButtonTrainNeuralNetwork
            loading={loading}
            onClick={() => trainNeuralNetworkMutation({
              variables: {
                trainNeuralNetworkInput: { neuralnetworkId }
              }
            })}
          />
        </Col>
      </Row>

      <ErrorMessage error={error} />
    </Space>
  )
}

export default NeuralNetworkController
