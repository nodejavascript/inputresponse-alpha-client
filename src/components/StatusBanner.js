import React from 'react'

import { Alert } from 'antd'

const StatusBanner = ({ type = 'default', message = 'unknown', description, bordered }) => {
  const banner = Boolean(!bordered)
  return (
    <Alert
      key={message}
      banner={banner}
      type={type}
      message={message}
      description={description}
    />
  )
}

export default StatusBanner
