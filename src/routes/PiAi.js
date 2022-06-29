// https://openbase.com/js/brain.js/documentation
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText

import React, { useRef, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'

import ErrorQuery from '../components/ErrorQuery'
import CoreCodeComment from '../components/CoreCodeComment'

import { INSERT_MODEL_SAMPLE } from '../routes/InsertModelSample'
import { CORE_QUERY_FIELDS } from '../lib'

import { Space, Card, Col, Button, Alert, Typography, Divider } from 'antd'

const { Text } = Typography

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

const INSERT_MODEL_PREDICTION = gql`
  mutation insertModelPredictionMutation ($insertModelPredictionInput: InsertModelPredictionInput!) {
    insertModelPrediction (insertModelPredictionInput: $insertModelPredictionInput) {

      ${CORE_QUERY_FIELDS}

      samplingclientId
      input: inputDisplay

      guessFloat
      guessRounded

      neuralNetwork {
        id
        name
        apiKey
      }
      samplingClient {
        id
        name
      }
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
  const [dimensions, setDimensions] = useState()
  const [resized, setResized] = useState(false)

  // logic
  const [trained, setTrained] = useState()
  const [neuralNetwork, setNeuralnetwork] = useState()

  const [input, setInput] = useState()

  const [disableModelSamplesMutation, { loading: disableModelSamplesLoading, error: disableModelSamplesError }] = useMutation(DISABLE_MODEL_SAMPLES)
  const [trainNeuralNetworkMutation, { loading: trainNeuralNetworkLoading, error: trainNeuralNetworkError }] = useMutation(TRAIN_NEURAL_NETWORK)
  const [insertModelSampleMutation, { data: insertModelSampleData, loading: insertModelSampleLoading, error: insertModelSampleError }] = useMutation(INSERT_MODEL_SAMPLE)

  const anythingLoading = disableModelSamplesLoading || trainNeuralNetworkLoading || insertModelSampleLoading

  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const returnCurrentDimensions = canvasRef => {
    const canvas = canvasRef.current
    const width = window.innerWidth * 2
    const height = window.innerHeight * 2
    canvas.width = width
    canvas.height = height
    canvas.style.width = '100%'
    canvas.style.height = '100%'

    const context = canvas.getContext('2d')
    context.lineCap = 'butt'
    context.strokeStyle = 'black'
    context.lineWidth = 2
    context.font = '24px serif'
    contextRef.current = context

    return { width, height }
  }

  const drawDot = ({ x, y, size = 10, color = 'black' }, noFill) => {
    const { current } = contextRef
    current.beginPath()
    current.strokeStyle = color
    current.fillStyle = color
    current.arc(x, y, size, 0, 2 * Math.PI)

    if (!noFill) {
      current.fill()
      current.fillText(`${x} x ${y}`, x - 50, y + 40)
    }

    current.stroke()
    contextRef.current = current
  }

  useEffect(() => {
    if (!insertModelSampleData?.insertModelSample || insertModelSampleData?.insertModelSample?.name) return

    const { input, output } = insertModelSampleData.insertModelSample

    const color = output[0] === 1 ? 'blue' : 'red'

    return drawDot({ ...input, color })
  }, [insertModelSampleData, drawDot])

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
        const { input } = sample
        drawDot({ ...input, color: 'purple' })
        await insertModelSampleMutation({
          variables: {
            insertModelSampleInput: { ...sample, ...insertCredentials, skipTraining: true }
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

  useEffect(() => {
    if (!input) return
    return drawDot(input)
  }, [input, drawDot])

  window.addEventListener('resize', () => setResized(true))

  if (disableModelSamplesError) return <ErrorQuery error={disableModelSamplesError} />
  if (insertModelSampleError) return <ErrorQuery error={insertModelSampleError} />
  if (trainNeuralNetworkError) return <ErrorQuery error={trainNeuralNetworkError} />

  return (
    <Space direction='vertical' style={{ width: '100%' }}>

      <Statuses
        resized={resized}
        neuralNetwork={neuralNetwork}
        dimensions={dimensions}
        disableModelSamplesLoading={disableModelSamplesLoading}
        insertModelSampleLoading={insertModelSampleLoading}
        trainNeuralNetworkLoading={trainNeuralNetworkLoading}
        trained={trained}
      />

      <ResizeAlarm
        resized={resized}
        setDimensions={setDimensions}
        anythingLoading={anythingLoading}
      />

      <ControlPanel
        resized={resized}
        dimensions={dimensions}
        apiKey={neuralNetwork?.apiKey}
        trained={trained}
        input={input}
        setInput={setInput}
        insertModelSampleMutation={insertModelSampleMutation}
        insertModelSampleLoading={insertModelSampleLoading}
        drawDot={drawDot}
      />

      <Canvas2D
        resized={resized}
        canvasRef={canvasRef}
        dimensions={dimensions}
      />

    </Space>
  )
}

export default PiAi

const ControlPanel = ({ resized, dimensions, apiKey, trained, input, setInput, insertModelSampleMutation, insertModelSampleLoading, drawDot }) => {
  const [modelPrediction, setModelPrediction] = useState()

  const [insertModelPredictionMutation, { data: insertModelPredictionData, loading: insertModelPredictionLoading, error: insertModelPredictionError }] = useMutation(INSERT_MODEL_PREDICTION)

  useEffect(() => {
    if (insertModelPredictionData?.insertModelPrediction) return setModelPrediction(insertModelPredictionData.insertModelPrediction)
  }, [insertModelPredictionData])

  if (resized || !dimensions) return null

  if (insertModelPredictionError) return <ErrorQuery error={insertModelPredictionError} />

  const returnRandomCoordinates = dimensions => {
    const { width, height } = dimensions
    const x = Math.round(Math.random() * width)
    const y = Math.round(Math.random() * height)
    return { x, y }
  }

  return (
    <Card
      loading={!trained}
      title='ControlPanel'
      extra={<StatusBanner type='success' message={<CoreCodeComment code={JSON.stringify(dimensions)} />} />}
    >
      <Space direction='vertical' style={{ width: '100%' }}>

        {!input && <StatusBanner type='info' message='Need random coordinates.' />}
        <Button
          size='small'
          type={!input ? 'primary' : 'default'}
          onClick={() => {
            const coords = returnRandomCoordinates(dimensions)
            return setInput(coords)
          }}
        >
          Request random coordinates
        </Button>

        {input && <StatusBanner type='success' message='Random coordinates plotted:' description={<CoreCodeComment code={JSON.stringify(input)} />} />}

        {
          input &&
            <>
              {!modelPrediction && <StatusBanner type='info' message='Get prediction from model.' />}

              <Button
                size='small'
                type={!modelPrediction ? 'primary' : 'default'}
                loading={insertModelPredictionLoading}
                onClick={() => insertModelPredictionMutation({
                  variables: {
                    insertModelPredictionInput: { apiKey, samplingclientId, input }
                  }
                })}
              >
                Request prediction
              </Button>

              {
                  modelPrediction &&

                    <Space direction='vertical' style={{ width: '100%' }}>

                      <StatusBanner
                        type='success'
                        message='Prediction'
                        description={
                          (
                            <Space direction='vertical' style={{ width: '100%' }}>
                              <Space>input: <CoreCodeComment code={modelPrediction?.input} /></Space>
                              <Space>guessFloat: <CoreCodeComment code={modelPrediction?.guessFloat} /></Space>
                              <Space>guessRounded: <CoreCodeComment code={modelPrediction?.guessRounded} /></Space>
                            </Space>
                          )
                        }
                      />

                      <StatusBanner type='warning' message={modelPrediction?.guessRounded ? 'AI thinks INSIDE' : 'AI thinks OUTSIDE'} />

                      <CalulatedCorrectness modelPrediction={modelPrediction} dimensions={dimensions} drawDot={drawDot} />

                      <Divider />

                      <StatusBanner type='info' message='Train model with correct answer.' />
                      <Space>

                        <Button
                          size='small'
                          type='primary'
                          loading={insertModelSampleLoading}
                          onClick={async () => {
                            const { input: inputAsString, neuralNetwork, guessRounded } = modelPrediction
                            const input = JSON.parse(inputAsString)

                            const sample = {
                              input,
                              output: [guessRounded]
                            }

                            const { apiKey } = neuralNetwork
                            const insertCredentials = { apiKey, samplingclientId }

                            await insertModelSampleMutation({
                              variables: {
                                insertModelSampleInput: { ...sample, ...insertCredentials }
                              }
                            })
                          }}
                        >
                          Answer is right
                        </Button>

                        <Button
                          size='small'
                          type='danger'
                          loading={insertModelSampleLoading}
                          onClick={async () => {
                            const { input: inputAsString, neuralNetwork, guessRounded } = modelPrediction
                            const input = JSON.parse(inputAsString)

                            const sample = {
                              input,
                              output: [Math.abs(guessRounded - 1)]
                            }

                            const { apiKey } = neuralNetwork
                            const insertCredentials = { apiKey, samplingclientId }

                            await insertModelSampleMutation({
                              variables: {
                                insertModelSampleInput: { ...sample, ...insertCredentials }
                              }
                            })
                          }}
                        >
                          Answer is wrong, should be modelPrediction
                        </Button>

                      </Space>

                    </Space>
              }
            </>
        }

      </Space>

    </Card>
  )
}

export const CalulatedCorrectness = ({ modelPrediction, dimensions, drawDot }) => {
  const { input: inputAsString, guessRounded } = modelPrediction
  const input = JSON.parse(inputAsString)

  const { width, height } = dimensions

  const center = {
    x: parseInt(width / 2),
    y: parseInt(height / 2)
  }

  const shortestRadius = center.x < center.y ? center.x : center.y
  drawDot({ ...center, size: shortestRadius, color: 'purple' }, true)

  const a = input.x - center.x
  const b = input.y - center.y
  const distanceFromCenter = Math.sqrt((a * a) + (b * b))
  const correctOutput = distanceFromCenter <= shortestRadius ? 1 : 0
  const aiIsRight = guessRounded === correctOutput

  drawDot({ ...center, size: distanceFromCenter, color: 'blue' }, true)

  return (
    <StatusBanner type='warning' message={aiIsRight ? 'AI IS RIGHT' : 'AI IS WRONG'} />
  )
}

const Statuses = ({ neuralNetwork, resized, dimensions, disableModelSamplesLoading, insertModelSampleLoading, trainNeuralNetworkLoading, trained }) => {
  return (
    <>
      <Card title='The PiAi Experiment' extra='Status'>
        Train a Neural network with the center and the 4 corners of a canvas. Plot it's guesses as you train. Predictions will be colorized and a circle will begin to be dotted. AI will infer Pi.
      </Card>

      <Card
        title={<Col>Network: {neuralNetwork?.name}</Col>}
        extra='Status'
      >
        {resized && <StatusBanner type='error' message='Canvas resize broke experiment' />}

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
    </>
  )
}

const ResizeAlarm = ({ resized, setDimensions }) => {
  if (!resized) return <StatusBanner showIcon='true' type='warning' message='Do not resize canvas' description='Experiment is trained with { x, y } points from Canvas2D.' />
  return <Button size='small' danger onClick={() => setDimensions(false)}>Retrain Model</Button>
}

const Canvas2D = ({ canvasRef, dimensions, resized }) => {
  const type = resized && 'danger'
  return (
    <Card
      title='Canvas2D'
      extra='extra'
    >
      <Space direction='vertical' size='small' align='center'>

        <Text type={type}>{dimensions?.width} px</Text>

        <Space size='small'>
          <Text type={type}>{dimensions?.height} px</Text>

          <canvas
            ref={canvasRef}
            style={style}
          />

        </Space>

      </Space>
    </Card>
  )
}

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
    output: [1]
  })

  return samples
}
