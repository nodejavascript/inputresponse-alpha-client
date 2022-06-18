import React from 'react'
import SimpleLink from '../SimpleLink'
import CellFormat from './CellFormat'
// import ModelSize from '../ModelSize'

import { Typography, Badge } from 'antd'

const { Text } = Typography

// <ModelSize record={record} />

export const CellName = ({ record, cardPath }) => {
  const { id, name } = record

  return (
    <CellFormat
      topRow={<SimpleLink to={`${cardPath}/${id}`} content={name || 'null'} style={{ paddingLeft: 0 }} />}
      bottomRow={<Text copyable>{id}</Text>}
    />
  )
}

export const CellStatus = ({ record }) => {
  const topRow = record?.enabled ? <Badge status='success' text='Enabled' /> : <Badge status='default' text='Not enabled' />
  const bottomRow = record?.archived ? <Badge status='warning' text='Archived' /> : null

  return (
    <CellFormat
      topRow={topRow}
      bottomRow={bottomRow}
    />
  )
}

export const CellDates = ({ record }) => {
  const { updatedAtAgo, createdAt } = record
  return (
    <CellFormat
      topRow={<>Updated {updatedAtAgo}</>}
      bottomRow={<>Created: {createdAt}</>}
    />
  )
}
