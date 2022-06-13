import React from 'react'
import { Result } from 'antd'
import SimpleLink from '../components/SimpleLink'

const NoMatch = () => {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra=<SimpleLink to='/' content='Go back home' />
    />
  )
}

export default NoMatch
