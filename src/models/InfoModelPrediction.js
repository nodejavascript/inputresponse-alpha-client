import React from 'react'

import CoreCodeComment from '../components/CoreCodeComment'
import NetworkDiagramSVG from '../components/NetworkDiagramSVG'
import { PredictionFirstGuess } from '../routes/ListModelPredictions'

import { Space, Alert } from 'antd'

const InfoModelPrediction = ({ record }) => {
  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>

      <Alert
        banner
        type='info'
        message={(
          <>
            Predictions can be posted to API and you can do it here too. If your prediction achieves fitness, you can post insert the model sample to the API.
          </>
        )}
      />

      {
        record &&
          <>
            <Space>neuralNetwork: {record?.neuralNetwork?.name}</Space>
            <Space>samplingClient: {record?.samplingClient?.name}</Space>

            <Space>input: <CoreCodeComment code={record?.input} /></Space>

            <Space>prediction time: {record?.predictionMs} ms</Space>
            <Space>likely: {record?.likely}</Space>

            <PredictionFirstGuess record={record} />
            <NetworkDiagramSVG record={record} />
          </>
      }
    </Space>
  )
}

export default InfoModelPrediction
