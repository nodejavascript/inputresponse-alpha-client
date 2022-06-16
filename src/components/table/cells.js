import React from 'react'
import SimpleLink from '../SimpleLink'
import CellFormat from './CellFormat'

import { Typography, Badge } from 'antd'

const { Text } = Typography

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
  if (record.archived) return <Badge status='default' text='Archived' />
  if (!record?.enabled) return <Badge status='default' text='Not enabled' />
  return <Badge status='success' text='Enabled' />
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
