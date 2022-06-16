import React from 'react'
import SimpleLink from '../SimpleLink'
import CellFormat from './CellFormat'
import ModelSize from '../ModelSize'

import { Typography, Badge, Row, Col } from 'antd'

const { Text } = Typography

export const CellName = ({ record, cardPath }) => {
  const { id, name } = record

  return (
    <CellFormat
      topRow={
        <Row justify='space-between' align='middle'>
          <Col flex={1}>
            <SimpleLink to={`${cardPath}/${id}`} content={name || 'null'} style={{ paddingLeft: 0 }} />
          </Col>
          <Col>
            <ModelSize record={record} />
          </Col>
        </Row>
      }
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
