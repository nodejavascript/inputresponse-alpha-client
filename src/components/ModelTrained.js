import React from 'react'

import CellFormat from './table/CellFormat'
// import { green } from '@ant-design/colors'
import { Badge } from 'antd'

const ModelTrained = ({ record }) => {
  if (!record) return null
  let topRow = <Badge status='default' text='Offline' />

  if (record.memoryNeuralNetwork) topRow = <Badge status='default' text='Online, untrained' />

  if (record.memoryNeuralNetwork?.isTrained) topRow = <Badge status='processing' text='Trained' />
  return (
    <CellFormat
      topRow={topRow}
    />
  )
}

export default ModelTrained
