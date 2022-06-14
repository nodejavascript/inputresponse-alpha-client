import React from 'react'

import SimpleLink from '../components/SimpleLink'

import { Card, Result } from 'antd'

const NoMatch = () => {
  return (
    <Card>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra=<SimpleLink to='/' content='Go back home' />
      />
    </Card>
  )
}

export default NoMatch
