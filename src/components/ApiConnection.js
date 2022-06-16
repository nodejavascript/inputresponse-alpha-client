import React from 'react'

import { useReactiveVar } from '@apollo/client'
import { memoryConnected } from '../lib/apolloReactiveVars'

import { Alert, Button, Row, Col } from 'antd'

import { PlayCircleTwoTone } from '@ant-design/icons'

const Message = ({ text }) => {
  return (
    <Row justify='space-between' align='middle'>
      <Col>
        <>API is {text}</>
      </Col>
      <Col>
        <Button
          type='secondary'
          icon={<PlayCircleTwoTone />}
          onClick={() => memoryConnected('refresh')}
        >
          Test
        </Button>
      </Col>
    </Row>
  )
}

const ApiConnection = ({ disconnectedOnly }) => {
  const isConnected = useReactiveVar(memoryConnected)

  const text = isConnected ? 'Connected' : 'Disconnected'
  const type = isConnected ? 'success' : 'warning'
  return (
    <Alert
      showIcon
      banner
      message={<Message text={text} />}
      bordered={false}
      type={type}
    />
  )
}

export default ApiConnection
