import React, { useEffect, useState } from 'react'

import { gapi } from 'gapi-script'

import Login from '../components/Login'
import Logout from '../components/Logout'

import { Spin } from 'antd'

const { REACT_APP_GOOGLE_CLIENTID } = process.env

const Auth = ({ user }) => {
  const [loading, setLoading] = useState(true)

  const start = async () => {
    await gapi.client.init({
      client_Id: REACT_APP_GOOGLE_CLIENTID,
      scope: ''
    })
    setLoading(false)
  }

  useEffect(() => {
    gapi.load('client:auth2', start)
  }, [])

  if (loading) return <Spin />

  if (user) return <Logout clientId={REACT_APP_GOOGLE_CLIENTID} user={user} />

  return <Login clientId={REACT_APP_GOOGLE_CLIENTID} user={user} />
}

export default Auth
