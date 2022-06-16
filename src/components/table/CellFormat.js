import React from 'react'

import { Row, Col, Typography } from 'antd'

const { Text } = Typography

const CellFormat = ({ topRow, bottomRow }) => {
  return (
    <>
      <Row>
        <Col>
          <Text>{topRow}</Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Text style={{ fontSize: 8 }}>{bottomRow}</Text>
        </Col>
      </Row>
    </>
  )
}

export default CellFormat
