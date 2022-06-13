import React from 'react'

import { Descriptions } from 'antd'

const { Item } = Descriptions

const CoreDescriptions = ({ record = {} }) => {
  return (
    <Descriptions bordered='true'>
      {
        Object.entries(record).map(([key, value]) => <Item key={key} label={key}>{value?.toString()}</Item>)
      }
    </Descriptions>
  )
}

export default CoreDescriptions
