import React from 'react'

import CenterContent from '../components/CenterContent'
import Auth from '../models/Auth'

import { Card, Space } from 'antd'

const AuthenticationRequired = ({ title = 'Not authenticated' }) => {
  return (
    <CenterContent>
      <Card
        title={title}
      >
        <Space>
          This module requires a userId so we can save your creations.
          <Auth />
        </Space>
      </Card>
    </CenterContent>
  )
}

export default AuthenticationRequired
