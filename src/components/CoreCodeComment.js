import React from 'react'

import { Typography } from 'antd'
const { Title, Text } = Typography

const CoreCodeComment = ({ code: codeallegedly, level }) => {
  const code = `${codeallegedly}`

  if (!level) return <Text code>{code}</Text>
  return <Title code level={level}>{code}</Title>
}

export default CoreCodeComment
