import React from 'react'

import { Row, Col, Typography } from 'antd'

const { Text } = Typography

const CellFormat = ({ topRow, bottomRow }) => {
  const top = <Text>{topRow}</Text>
  if (!bottomRow) return top
  return (
    <>
      <Row>
        <Col flex={1}>
          {top}
        </Col>
      </Row>
      {
        bottomRow &&
          <Row>
            <Col>
              <Text style={{ fontSize: 12 }}>{bottomRow}</Text>
            </Col>
          </Row>
      }
    </>
  )
}

export default CellFormat
