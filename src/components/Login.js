import React from 'react'

import { memoryUser } from '../lib/apolloReactiveVars'

import { GoogleLogin } from 'react-google-login'

import { Button } from 'antd'

const Login = ({ clientId, user }) => {
  if (user) return null

  const onLoginSuccess = res => {
    const { tokenId } = res
    memoryUser({ tokenId })
  }

  const onLoginFailure = err => {
    memoryUser(false)
    console.error('onLoginFailure', err)
  }

  return (
    <GoogleLogin
      render={renderProps => (
        <Button onClick={() => renderProps.onClick()} disabled={renderProps.disabled}>Login</Button>
      )}
      clientId={clientId}
      buttonText='Login'
      onSuccess={onLoginSuccess}
      onFailure={onLoginFailure}
      cookiePolicy='single_host_origin'
      isSignedIn
    />
  )
}

export default Login
