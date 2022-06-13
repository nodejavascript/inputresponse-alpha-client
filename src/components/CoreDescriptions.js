import React from 'react'

import { Card } from 'antd'
import ReactJson from 'react-json-view'

const CoreDescriptions = ({ record, column = 1, title, extra, collapsed }) => {
  if (!record) return null

  return (
    <Card
      size='small'
      bordered={false}
      extra={extra}
    >
      {title}
      <ReactJson src={record} theme='google' collapsed={collapsed} edit={false} />
    </Card>
  )
}

export default CoreDescriptions
