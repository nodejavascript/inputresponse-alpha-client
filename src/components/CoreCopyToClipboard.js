import React, { useEffect } from 'react'

import CoreCodeComment from './CoreCodeComment'

import { Typography, message, Col, Card, Row } from 'antd'
import { SnippetsTwoTone } from '@ant-design/icons'

const { Text } = Typography

const CoreResponse = ({ field, text, icon }) => (
  <Col>
    <Text copyable={{ text, icon }}>
      Copy <CoreCodeComment code={field} /> to clipboard
    </Text>
  </Col>
)

const CoreCopyToClipboard = ({ field, text }) => {
  useEffect(() => {
    if (!text) return message.error(`no text to copy field ${field}`)
  }, [field, text])

  const icon = <SnippetsTwoTone style={{ fontSize: 24 }} />

  return (
    <Row justify='center'>
      <Card
        hoverable
        size='small'
        bordered={false}
      >
        <CoreResponse field={field} text={text} icon={icon} />
      </Card>
    </Row>
  )
}

export default CoreCopyToClipboard
