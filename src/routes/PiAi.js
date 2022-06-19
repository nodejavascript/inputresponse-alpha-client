import React, { useRef, useEffect, useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'

import ErrorQuery from '../components/ErrorQuery'
import CenterContent from '../components/CenterContent'
import { QUERY_NEURAL_NETWORK } from '../routes/CardNeuralNetwork'
import { INSERT_MODEL_SAMPLE } from '../routes/InsertModelSample'
import { UPDATE_MODEL_SAMPLE } from '../routes/UpdateModelSample'

import { Space, Card, Col } from 'antd'

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
  const [samplesAdded, setSamplesAdded] = useState()

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

  const {
    data: queryNeuralNetworkData,
    loading: queryNeuralNetworkLoading,
    error: queryNeuralNetworkError,
    refetch: queryNeuralNetworkRefetch
  } = useQuery(QUERY_NEURAL_NETWORK, { variables: { queryNeuralNetworkInput: { neuralnetworkId } } })

  const [insertModelSampleMutation, { loading: insertModelSampleLoading, error: insertModelSampleError }] = useMutation(INSERT_MODEL_SAMPLE)
  const [updateModelSampleMutation, { loading: updateModelSampleLoading, error: updateModelSampleError }] = useMutation(UPDATE_MODEL_SAMPLE)

  useEffect(async () => {
    if (samplesAdded) return queryNeuralNetworkRefetch()
    if (!dimensions) return
    if (!queryNeuralNetworkData) return

    const { neuralNetwork } = queryNeuralNetworkData
    if (!neuralNetwork) return

    const { apiKey, modelSamples } = neuralNetwork
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

    return setSamplesAdded(true)
  }, [queryNeuralNetworkData, dimensions, samplesAdded, setSamplesAdded, queryNeuralNetworkRefetch])

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
              {'STATUS: '}

              {!dimensions && 'Loading dimensions'}
              {updateModelSampleLoading && 'Disabling exisitng samples'}
              {insertModelSampleLoading && 'Inserting training samples'}
              {samplesAdded && 'Ready'}
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
