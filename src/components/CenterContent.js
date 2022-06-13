import React from 'react'
import { Row, Col, Card } from 'antd'

const Center = ({ children }) => {
  return (
    <Row justify='center' style={{ paddingTop: '36px' }}>
      <Col
        xs={24}
        sm={20}
        md={14}
        lg={10}
        xl={9}
        xxl={8}
      >
        {children}
      </Col>
    </Row>
  )
}

const CenterContent = ({ children, bordered }) => {
  if (bordered) {
    return (
      <Center>
        <Card>
          {children}
        </Card>
      </Center>
    )
  }
  return (
    <Center>
      {children}
    </Center>
  )
}

export default CenterContent
