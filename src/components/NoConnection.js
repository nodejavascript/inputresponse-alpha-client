import React from 'react'

import { useReactiveVar } from '@apollo/client'
import { memoryConnected } from '../lib/apolloReactiveVars'

import { Alert, Button, Space } from 'antd'

import { RedoOutlined } from '@ant-design/icons'

const Message = () => {
  return (
    <Space>
      <>API is not connected</>
      <Button type='primary' icon={<RedoOutlined />} onClick={() => memoryConnected('refresh')} />
    </Space>
  )
}

const NoConnection = () => {
  const isConnected = useReactiveVar(memoryConnected)
  if (isConnected === true) return null

  return (
    <Alert
      message={<Message />}
      type='warning'
    />
  )
}

export default NoConnection
