import React from 'react'

import CoreCodeComment from './CoreCodeComment'
import CellFormat from './table/CellFormat'

import { Space } from 'antd'

const PredictionFirstGuess = ({ record }) => {
  return (
    <CellFormat
      topRow={(
        <Space>
          Guess:
          <CoreCodeComment code={record?.guesses[0]?.guess} />
        </Space>
      )}
      bottomRow={(
        <Space>
          Confidence:
          <CoreCodeComment code={record?.guesses[0]?.confidence} />
        </Space>
      )}
    />
  )
}

export default PredictionFirstGuess
