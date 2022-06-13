import React from 'react'

import { Alert } from 'antd'

const ErrorMessage = ({ error }) => {
  if (!error) return null

  return (
    <Alert
      message={error?.message || JSON.stringify(error)}
      type='error'
    />
  )
}

export default ErrorMessage
