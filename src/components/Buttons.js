import React from 'react'

import SimpleLink from './SimpleLink'

import { Space } from 'antd'

const Buttons = ({ buttons = [] }) => {
  if (buttons.length === 0) return null

  return (
    <Space size='small' direction='vertical'>
      {
        buttons.map(({ to, type = 'default', content }) => <SimpleLink key={`linkto${to}`} to={to} content={content} type={type} block />)
      }
    </Space>
  )
}

export default Buttons
