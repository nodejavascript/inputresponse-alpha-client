import React from 'react'

import { memoryUser } from '../lib/apolloReactiveVars'

import { GoogleLogout } from 'react-google-login'

import { Button } from 'antd'

const Logout = ({ clientId, user }) => {
  if (!user) return null

  const onLogoutSuccess = res => {
    memoryUser(false)
  }

  return (
    <GoogleLogout
      render={renderProps => (
        <Button onClick={() => renderProps.onClick()} disabled={renderProps.disabled}>Logout</Button>
      )}
      clientId={clientId}
      buttonText='Logout'
      onLogoutSuccess={onLogoutSuccess}
    />
  )
}

export default Logout
