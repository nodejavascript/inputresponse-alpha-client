import React, { useRef, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'

import ErrorQuery from '../components/ErrorQuery'
import CenterContent from '../components/CenterContent'
import { INSERT_MODEL_SAMPLE } from '../routes/InsertModelSample'

import { Space, Card, Col, Button, Alert } from 'antd'

const neuralnetworkId = '62ae4da63976c4a5dfbbab9f'
const samplingclientId = '62ae59ca3976c4a5dfbbabff'

const FIELDS_NEURAL_NETWORK = `
  id
  name
  apiKey
  modelSamples {
    id
    input
    output
  }
  memoryNeuralNetwork {
    trainingMs
  }
`

const DISABLE_MODEL_SAMPLES = gql`
  mutation disableModelSamplesMutation ($disableModelSamplesInput: DisableModelSamplesInput!) {
    disableModelSamples (disableModelSamplesInput: $disableModelSamplesInput) {
      ${FIELDS_NEURAL_NETWORK}
    }
  }
`

const TRAIN_NEURAL_NETWORK = gql`
  mutation trainNeuralNetworkMutation ($trainNeuralNetworkInput: TrainNeuralNetworkInput!) {
    trainNeuralNetwork (trainNeuralNetworkInput: $trainNeuralNetworkInput) {
      ${FIELDS_NEURAL_NETWORK}
    }
  }
`

const StatusBanner = ({ type = 'default', message = 'unknown', description }) => {
  return (
    <Alert
      key={message}
      banner
      type={type}
      message={message}
      description={description}
    />
  )
}

const PiAi = () => {
  const canvasRef = useRef(null)
  const returnCurrentDimensions = canvasRef => {
    const canvas = canvasRef.current
    const width = window.innerWidth * 2
    const height = window.innerHeight * 2
    canvas.width = width
    canvas.height = height
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    return { width, height }
  }

  // const contextRef = useRef(null)

  // canvas
  const [dimensions, setDimensions] = useState()
  const [resized, setResized] = useState(false)

  // logic
  const [trained, setTrained] = useState()
  const [neuralNetwork, setNeuralnetwork] = useState()

  const [disableModelSamplesMutation, { loading: disableModelSamplesLoading, error: disableModelSamplesError }] = useMutation(DISABLE_MODEL_SAMPLES)
  const [trainNeuralNetworkMutation, { loading: trainNeuralNetworkLoading, error: trainNeuralNetworkError }] = useMutation(TRAIN_NEURAL_NETWORK)
  const [insertModelSampleMutation, { loading: insertModelSampleLoading, error: insertModelSampleError }] = useMutation(INSERT_MODEL_SAMPLE)

  // CANVAS ON LOAD
  useEffect(() => {
    if (!dimensions) {
      const currentDimensions = returnCurrentDimensions(canvasRef)
      return setDimensions(currentDimensions)
    }
  }, [dimensions, returnCurrentDimensions, setDimensions])

  useEffect(() => {
    if (neuralNetwork) return setResized(false)
  }, [neuralNetwork, setResized])

  // init setup training, reuabe if resized
  useEffect(async () => {
    if (!dimensions) return setTrained(false)

    if (trained) return

    const disableModelSamplesData = await disableModelSamplesMutation({
      variables: {
        disableModelSamplesInput: { neuralnetworkId }
      }
    })

    if (!disableModelSamplesData?.data?.disableModelSamples) return

    const { apiKey } = disableModelSamplesData.data.disableModelSamples
    const insertCredentials = { apiKey, samplingclientId }

    await Promise.all(
      returnTrainingSamples(dimensions).map(async sample => {
        await insertModelSampleMutation({
          variables: {
            insertModelSampleInput: { ...sample, ...insertCredentials }
          }
        })
      })
    )

    const trainedNeuralnetwork = await trainNeuralNetworkMutation({
      variables: {
        trainNeuralNetworkInput: { neuralnetworkId }
      }
    })

    if (!trainedNeuralnetwork?.data?.trainNeuralNetwork) return

    setNeuralnetwork(trainedNeuralnetwork.data.trainNeuralNetwork)
    return setTrained(true)
  }, [dimensions, trained, disableModelSamplesMutation, returnTrainingSamples, setNeuralnetwork])

  window.addEventListener('resize', () => setResized(true))

  if (disableModelSamplesError) return <ErrorQuery error={disableModelSamplesError} />
  if (insertModelSampleError) return <ErrorQuery error={insertModelSampleError} />
  if (trainNeuralNetworkError) return <ErrorQuery error={trainNeuralNetworkError} />

  return (
    <CenterContent>
      <Space direction='vertical'>
        <Card
          title={<Col>Network: {neuralNetwork?.name}</Col>}
          extra={<Col>Samples: {neuralNetwork?.modelSamples?.length}</Col>}
        >

          {resized && <StatusBanner type='error' message='Canvas resize broke experiment' />}
          {!resized && <StatusBanner showIcon='true' type='warning' message='Do not resize canvas' description='Experiment is trained with { x, y } points from 4 corners and center of Canvas2D.' />}

          {!dimensions && <StatusBanner type='info' message='Canvas loading...' />}
          {dimensions && <StatusBanner type='success' message='Canvas loaded.' />}

          {disableModelSamplesLoading && <StatusBanner type='info' message='Disabling existing model samples...' />}
          {insertModelSampleLoading && <StatusBanner type='info' message='Inserting canvas dependent training samples...' />}
          {trainNeuralNetworkLoading && <StatusBanner type='info' message='Training model...' />}

          {!trained && <StatusBanner type='success' message='Model requires training.' />}
          {trained && <StatusBanner type='success' message='Model training complete.' />}

          {!neuralNetwork && <StatusBanner type='info' message='Neural Network loading...' />}
          {neuralNetwork && <StatusBanner type='success' message='Neural Network loaded.' />}

        </Card>

        {resized && <Button size='small' danger onClick={() => setDimensions(false)}>Retrain Model</Button>}

        {
          !resized &&
            <Card
              title='Training'
              extra='extra'
            >
              <Space direction='vertical' size='small' align='center'>

                <Button size='small'>Request Prediction</Button>

              </Space>
            </Card>
        }
        <Card
          title='Canvas2D'
          extra='extra'
        >
          <Space direction='vertical' size='small' align='center'>

            {dimensions?.width}

            <Space size='small'>
              {dimensions?.height}

              <canvas
                ref={canvasRef}
                style={style}
              />

            </Space>

          </Space>
        </Card>

      </Space>
    </CenterContent>
  )
}

export default PiAi

// 3.14 x 7.62^2 x 3.048 = 150 m3
const style = {
  width: '100%',
  border: '1px solid black',
  backgroundColor: '#fafafa'
}

const returnTrainingSamples = ({ width, height }) => {
  const samples = []

  samples.push({
    name: 'topLeft',
    input: { x: 0, y: 0 },
    output: [0]
  })

  samples.push({
    name: 'topRight',
    input: { x: width, y: 0 },
    output: [0]
  })

  samples.push({
    name: 'bottomRight',
    input: { x: width, y: height },
    output: [0]
  })

  samples.push({
    name: 'bottomLeft',
    input: { x: 0, y: height },
    output: [0]
  })

  samples.push({
    name: 'center',
    input: { x: parseInt(width / 2), y: parseInt(height / 2) },
    output: [0]
  })

  return samples
}

// const mouseDown = ({ nativeEvent }) => {
//   const { offsetX, offsetY } = nativeEvent
//   const { current } = contextRef
//
//   current.strokeStyle = returnHue(hue)
//   current.beginPath()
//   current.moveTo(offsetX, offsetY)
//   setIsDrawing(true)
// }
