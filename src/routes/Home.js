import React from 'react'
import Iframe from 'react-iframe'

import CoreCard from '../components/CoreCard'
import NoConnection from '../components/NoConnection'

import { Space } from 'antd'

const CoreIframe = ({ url }) => {
  const frameBorder = 0
  return (
    <Iframe
      url={url}
      height={400}
      position='inital'
      scrolling='yes'
      frameBorder={frameBorder}
    />
  )
}

const CoreIframes = () => {
  const urls = [
    'https://nodejavascript.com',
    'https://georgefielder.com'
  ]

  return (
    <Space>
      {urls.map(url => <CoreIframe key={`iframe${url}`} url={url} />)}
    </Space>
  )
}

const Home = () => {
  return (
    <CoreCard>
      <Space size='large' direction='vertical'>
        <NoConnection />
        <CoreIframes />
      </Space>
    </CoreCard>
  )
}

export default Home
