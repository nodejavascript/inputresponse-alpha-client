// https://openbase.com/js/brain.js/documentation
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText

import React, { useRef, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'

import ErrorQuery from '../components/ErrorQuery'
import CoreCodeComment from '../components/CoreCodeComment'

import { INSERT_MODEL_SAMPLE } from '../routes/InsertModelSample'
import { CORE_QUERY_FIELDS } from '../lib'

import { Space, Card, Col, Button, Alert, Typography, List } from 'antd'

const { Text } = Typography

const neuralnetworkId = '62ae4da63976c4a5dfbbab9f'
const samplingclientId = '62ae59ca3976c4a5dfbbabff'

const backgroundColor = '#fafafa'

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
  const [correctAiOutput, setCorrectAiOutput] = useState()
  const [neuralNetwork, setNeuralnetwork] = useState()

  const [input, setInput] = useState()

  const [disableModelSamplesMutation, { loading: disableModelSamplesLoading, error: disableModelSamplesError }] = useMutation(DISABLE_MODEL_SAMPLES)
  const [trainNeuralNetworkMutation, { loading: trainNeuralNetworkLoading, error: trainNeuralNetworkError }] = useMutation(TRAIN_NEURAL_NETWORK)
  const [insertModelSampleMutation, { loading: insertModelSampleLoading, error: insertModelSampleError }] = useMutation(INSERT_MODEL_SAMPLE)

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
    context.font = '48px serif'
    contextRef.current = context

    return { width, height }
  }

  const drawDot = (ctx, options) => {
    const { x, y, size = 10, color = 'black', label, dontfill } = options
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.arc(x, y, size, 0, 2 * Math.PI)
    ctx.stroke()

    if (dontfill) return

    ctx.fill()
    ctx.fillText(label || `${x} x ${y}`, x - 50, y + 40)
  }

  // CANVAS ON LOAD
  useEffect(() => {
    if (!dimensions) {
      const currentDimensions = returnCurrentDimensions(canvasRef)
      return setDimensions(currentDimensions)
    }
  }, [dimensions, returnCurrentDimensions, setDimensions])

  // handle resize which changes the circle radius
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
        return insertModelSampleMutation({
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

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const coords = { input }
    const correctness = returnCalulatedCorrectness({ coords, dimensions })

    const { correctAiOutput } = correctness

    // if 1, inside cirlce, 0 is outside
    const color = correctAiOutput ? 'blue' : 'black'

    drawDot(context, { ...input, size: 40, color })
    // drawDot(context, { ...canvasCenter, size: inputRadius, color, dontfill: true })
    return setCorrectAiOutput(correctAiOutput)
  }, [input, dimensions, drawDot, setCorrectAiOutput])

  useEffect(() => {
    if (!trained) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const color = 'purple'

    returnTrainingSamples(dimensions).forEach(sample => {
      const { input, name: label } = sample
      drawDot(context, { ...input, size: 20, color, label })
    })

    const correctness = returnCalulatedCorrectness({ dimensions })
    const { canvasCenter, canvasRadius } = correctness

    drawDot(context, { ...canvasCenter, size: canvasRadius, color, dontfill: true })
  }, [trained, dimensions, drawDot])

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

      <Space align='top' style={{ width: '100%' }}>

        <ControlPanel
          resized={resized}
          dimensions={dimensions}
          apiKey={neuralNetwork?.apiKey}
          trained={trained}
          input={input}
          setInput={setInput}
          insertModelSampleMutation={insertModelSampleMutation}
          insertModelSampleLoading={insertModelSampleLoading}
          canvasRef={canvasRef}
          drawDot={drawDot}
          correctAiOutput={correctAiOutput}
        />

        <Canvas2D
          resized={resized}
          canvasRef={canvasRef}
          dimensions={dimensions}
          trained={trained}
        />

      </Space>

    </Space>
  )
}

export default PiAi

const ControlPanel = ({ resized, dimensions, apiKey, trained, input, setInput, insertModelSampleMutation, insertModelSampleLoading, canvasRef, drawDot, correctAiOutput }) => {
  const [modelPrediction, setModelPrediction] = useState()
  const [correctness, setCorrectness] = useState()
  const [running, setRunning] = useState()

  const [insertModelPredictionMutation, { data: insertModelPredictionData, loading: insertModelPredictionLoading, error: insertModelPredictionError }] = useMutation(INSERT_MODEL_PREDICTION)

  useEffect(() => {
    return setModelPrediction(insertModelPredictionData?.insertModelPrediction)
  }, [insertModelPredictionData, setModelPrediction])

  useEffect(() => {
    if (!modelPrediction) return

    const { input, guessRounded } = modelPrediction
    const coords = { input }

    const correctness = returnCalulatedCorrectness({ coords, dimensions, guessRounded })

    return setCorrectness(correctness)
  }, [modelPrediction, dimensions, setCorrectness])

  useEffect(() => {
    if (!correctness) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const { canvasCenter, inputRadius, isAiCorrect } = correctness
    const input = JSON.parse(correctness.input)

    const color = isAiCorrect ? 'green' : 'red'
    drawDot(context, { ...input, size: 20, color })
    drawDot(context, { ...canvasCenter, size: inputRadius, color: backgroundColor, dontfill: true })
  }, [correctness, canvasRef, drawDot])

  useEffect(() => {
    if (!input) return setModelPrediction(false)
  }, [input, setModelPrediction])

  const returnRandomCoordinates = dimensions => {
    const { width, height } = dimensions
    const x = Math.round(Math.random() * width)
    const y = Math.round(Math.random() * height)
    return { x, y }
  }

  const runOnce = async (dimensions, setInput, setModelPrediction, insertModelPredictionMutation, insertModelPredictionInput, setRunning) => {
    setRunning(true)
    const coords = await setNewCoordsToInput(dimensions, setInput, setModelPrediction)

    const insertModelPrediction = await requestModelPrediction(insertModelPredictionMutation, { ...insertModelPredictionInput, input: coords })

    const autoModelPrediction = insertModelPrediction.data.insertModelPrediction

    setModelPrediction(autoModelPrediction)
    await trainModelWithFitness(dimensions, autoModelPrediction)

    setRunning(false)
  }

  const setNewCoordsToInput = (dimensions, setInput, setModelPrediction) => {
    const coords = returnRandomCoordinates(dimensions)

    setInput(coords)
    setModelPrediction(false)
    return coords
  }

  const requestModelPrediction = (insertModelPredictionMutation, insertModelPredictionInput) => {
    return insertModelPredictionMutation({
      variables: { insertModelPredictionInput }
    })
  }

  const trainModelWithFitness = async (dimensions, modelPrediction) => {
    const { guessRounded, neuralNetwork, samplingclientId } = modelPrediction
    const { apiKey } = neuralNetwork

    const input = JSON.parse(modelPrediction.input)

    const coords = { input }

    const correctness = returnCalulatedCorrectness({ dimensions, coords, guessRounded })

    const output = [correctness?.correctAiOutput]

    const insertModelSampleInput = { apiKey, samplingclientId, input, output }

    await insertModelSampleMutation({
      variables: {
        insertModelSampleInput
      }
    })

    return setInput(false)
  }

  if (resized || !dimensions) return null

  if (insertModelPredictionError) return <ErrorQuery error={insertModelPredictionError} />

  return (
    <Card
      loading={!trained}
      title='Control Panel'
      extra={
        <Button
          loading={running}
          disabled={!trained}
          size='small'
          shape='round'
          type='default'
          onClick={() => runOnce(dimensions, setInput, setModelPrediction, insertModelPredictionMutation, { apiKey, samplingclientId }, setRunning)}
        >
          Run Once
        </Button>
      }
    >
      <Space direction='vertical' style={{ width: '100%' }}>

        <StatusBanner type='success' message='Canvas' description={<CoreCodeComment code={JSON.stringify(dimensions)} />} />

        {!input && <StatusBanner type='warning' message='Need random coordinates.' />}

        <Button
          block
          type={!input ? 'primary' : 'default'}
          onClick={() => setNewCoordsToInput(dimensions, setInput, setModelPrediction)}
        >
          Request random coordinates
        </Button>

        {
          input &&
            <Space direction='vertical' style={{ width: '100%' }}>
              <StatusBanner type='success' message='Random coordinates plotted.' description={<CoreCodeComment code={JSON.stringify(input)} />} />

              <List bordered style={{ padding: 0 }}>
                <StatusBanner type='info' message={`Dot is ${correctAiOutput ? 'INSIDE' : 'OUTSIDE'} circle.`} />
              </List>
            </Space>
        }

        {
          input &&
            <>
              {!modelPrediction && <StatusBanner type='warning' message='Need an AiPi prediction.' />}

              <Button
                block
                type={!modelPrediction ? 'primary' : 'default'}
                loading={insertModelPredictionLoading}
                onClick={() => requestModelPrediction(insertModelPredictionMutation, { apiKey, samplingclientId, input })}
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

                      {
                        correctness &&
                          <List bordered style={{ padding: 0 }}>
                            <Space direction='vertical' style={{ width: '100%' }}>
                              <StatusBanner type='warning' message={`AI predicts dot is ${correctness.guessRounded ? 'INSIDE' : 'OUTSIDE'} circle.`} />
                              <StatusBanner type={correctness.isAiCorrect ? 'success' : 'error'} message={`AI is ${correctness.isAiCorrect ? 'RIGHT' : 'WRONG'}.`} />
                            </Space>
                          </List>
                      }

                      <StatusBanner type='success' message='Train neural network.' />

                      <Button
                        block
                        type='primary'
                        loading={insertModelSampleLoading}
                        onClick={async () => trainModelWithFitness(dimensions, modelPrediction)}
                      >
                        Train Model that coords belong {correctness?.correctAiOutput ? 'INSIDE' : 'OUTSIDE'} circle
                      </Button>

                    </Space>
              }
            </>
        }

      </Space>

    </Card>
  )
}

const returnCalulatedCorrectness = ({ dimensions, coords, guessRounded }) => {
  const { width, height } = dimensions

  const canvasCenter = {
    x: parseInt(width / 2),
    y: parseInt(height / 2)
  }
  const canvasRadius = canvasCenter.x < canvasCenter.y ? canvasCenter.x : canvasCenter.y

  const correctness = {
    dimensions,
    canvasCenter,
    canvasRadius
  }

  if (!coords) return correctness

  const { input } = coords

  const a = input.x - canvasCenter.x
  const b = input.y - canvasCenter.y
  const inputRadius = Math.sqrt((a * a) + (b * b))
  const correctAiOutput = inputRadius <= canvasRadius ? 1 : 0

  const isAiCorrect = guessRounded === correctAiOutput

  correctness.input = input
  correctness.inputRadius = inputRadius
  correctness.correctAiOutput = correctAiOutput

  if (isNaN(guessRounded)) return correctness

  correctness.isAiCorrect = isAiCorrect

  return correctness
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

const style = {
  border: '1px solid black',
  backgroundColor
}

const Canvas2D = ({ canvasRef, dimensions, resized, trained }) => {
  const type = resized && 'danger'
  return (
    <Card
      title='Canvas2D'
      extra={
        <Button
          disabled={!trained}
          size='small'
          shape='round'
          type='default'
        >
          Reset
        </Button>
      }
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
