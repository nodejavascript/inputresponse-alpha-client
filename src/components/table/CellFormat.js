import React from 'react'

import { Row, Col, Typography } from 'antd'

const { Text } = Typography

const CellFormat = ({ topRow, bottomRow }) => {
  return (
    <>
      <Row>
        <Col flex={1}>
          <Text>{topRow}</Text>
        </Col>
      </Row>
      {
        bottomRow &&
          <Row>
            <Col>
              <Text style={{ fontSize: 10 }}>{bottomRow}</Text>
            </Col>
          </Row>
      }
    </>
  )
}

export default CellFormat
