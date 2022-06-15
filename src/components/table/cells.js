import React from 'react'
import SimpleLink from '../SimpleLink'

import { Row, Typography, Badge } from 'antd'

const { Text } = Typography

export const CellName = ({ record, cardPath }) => {
  const { id, name } = record

  return (
    <>
      <Row>
        <SimpleLink to={`${cardPath}/${id}`} content={name || 'null'} style={{ paddingLeft: 0 }} />
      </Row>
      <Row>
        <Text
          style={{ fontSize: 8 }}
          copyable
        >
          {id}
        </Text>
      </Row>
    </>
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
    <>
      <Row>
        <Text>Updated {updatedAtAgo}</Text>
      </Row>
      <Row>
        <Text
          style={{ fontSize: 8 }}
        >
          Created: {createdAt}
        </Text>
      </Row>
    </>
  )
}
