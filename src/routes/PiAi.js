import React, { useRef, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import ErrorQuery from '../components/ErrorQuery'
import CenterContent from '../components/CenterContent'
import { QUERY_NEURAL_NETWORK } from '../routes/CardNeuralNetwork'
import { INSERT_MODEL_SAMPLE } from '../routes/InsertModelSample'
import { UPDATE_MODEL_SAMPLE } from '../routes/UpdateModelSample'
import { TRAIN_NEURAL_NETWORK } from '../components/TrainNeuralNetwork'

import { Space, Card, Col, Spin, Button } from 'antd'

const neuralnetworkId = '62ae4da63976c4a5dfbbab9f'
const samplingclientId = '62ae59ca3976c4a5dfbbabff'

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

const PiAi = () => {
  const canvasRef = useRef(null)
  // const contextRef = useRef(null)

  const [dimensions, setDimensions] = useState()
  const [neuralNetwork, setNeuralnetwork] = useState()

  const {
    data: queryNeuralNetworkData,
    loading: queryNeuralNetworkLoading,
    error: queryNeuralNetworkError,
    refetch: queryNeuralNetworkRefetch
  } = useQuery(QUERY_NEURAL_NETWORK, { variables: { queryNeuralNetworkInput: { neuralnetworkId } } })

  // set dimensions after canvas loads
  useEffect(() => {
    const canvas = canvasRef.current
    const width = window.innerWidth * 2
    const height = window.innerHeight * 2
    canvas.width = width
    canvas.height = height
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    return setDimensions({ width, height })
  }, [setDimensions])

  const [insertModelSampleMutation, { loading: insertModelSampleLoading, error: insertModelSampleError }] = useMutation(INSERT_MODEL_SAMPLE)
  const [updateModelSampleMutation, { loading: updateModelSampleLoading, error: updateModelSampleError }] = useMutation(UPDATE_MODEL_SAMPLE)
  const [trainNeuralNetworkMutation, { loading: trainNeuralNetworkLoading, error: trainNeuralNetworkError }] = useMutation(TRAIN_NEURAL_NETWORK)

  // SETUP
  useEffect(async () => {
    if (neuralNetwork) return queryNeuralNetworkRefetch()
    if (!dimensions) return
    if (!queryNeuralNetworkData?.neuralNetwork) return

    const { apiKey, modelSamples } = queryNeuralNetworkData.neuralNetwork
    const insertCredentials = { apiKey, samplingclientId }

    await Promise.all(
      modelSamples.map(async sample => {
        const { id: modelsampleId, input, output, enabled } = sample

        enabled && await updateModelSampleMutation({
          variables: {
            updateModelSampleInput: { modelsampleId, input, output, enabled: false }
          }
        })
      })
    )

    await Promise.all(
      returnTrainingSamples(dimensions).map(async sample => {
        await insertModelSampleMutation({
          variables: {
            insertModelSampleInput: { ...sample, ...insertCredentials }
          }
        })
      })
    )

    await trainNeuralNetworkMutation({
      variables: {
        trainNeuralNetworkInput: { neuralnetworkId }
      }
    })

    return setNeuralnetwork(queryNeuralNetworkData.neuralNetwork)
  }, [queryNeuralNetworkData, dimensions, neuralNetwork, setNeuralnetwork, queryNeuralNetworkRefetch])

  useEffect(() => {
    if (neuralNetwork) console.log('neuralNetwork', neuralNetwork)
  }, [neuralNetwork])

  // const mouseDown = ({ nativeEvent }) => {
  //   const { offsetX, offsetY } = nativeEvent
  //   const { current } = contextRef
  //
  //   current.strokeStyle = returnHue(hue)
  //   current.beginPath()
  //   current.moveTo(offsetX, offsetY)
  //   setIsDrawing(true)
  // }

  if (queryNeuralNetworkError) return <ErrorQuery error={queryNeuralNetworkError} />
  if (insertModelSampleError) return <ErrorQuery error={insertModelSampleError} />
  if (updateModelSampleError) return <ErrorQuery error={updateModelSampleError} />
  if (trainNeuralNetworkError) return <ErrorQuery error={trainNeuralNetworkError} />

  return (
    <CenterContent>
      <Space direction='vertical'>
        <Card
          title={<Col>Network: {queryNeuralNetworkData?.neuralNetwork?.name}</Col>}
          extra={<Col>Samples: {queryNeuralNetworkData?.neuralNetwork?.modelSize}</Col>}
        >
          <Space
            direction='vertical'
            size='small'
            loading={queryNeuralNetworkLoading.toString()}
          >
            <Col>
              SETUP:
              {' '}
              {!neuralNetwork && <Spin size='small' />}
              {' '}
              {!dimensions && 'Loading dimensions'}
              {updateModelSampleLoading && 'Disabling exisitng samples'}
              {insertModelSampleLoading && 'Inserting training samples'}
              {neuralNetwork && 'Ready'}
            </Col>

            <Col>
              Model:
              {' '}
              {!neuralNetwork?.memoryNeuralNetwork && 'Untrained'}
              {neuralNetwork?.memoryNeuralNetwork?.trainingMs && `Training time: ${neuralNetwork.memoryNeuralNetwork.trainingMs} ms`}

              {trainNeuralNetworkLoading && <Spin size='small' />}
              {' '}
              {trainNeuralNetworkLoading && 'Training..'}
            </Col>


          </Space>
        </Card>

        <Card
          title='Canvas 2d'
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
