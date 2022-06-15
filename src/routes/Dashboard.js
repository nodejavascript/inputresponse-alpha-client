import React from 'react'

import CoreCard from '../components/CoreCard'
import CoreCodeComment from '../components/CoreCodeComment'
import ListNeuralNetworks from './ListNeuralNetworks'
import ListSamplingClients from './ListSamplingClients'
import ListModelSamples from './ListModelSamples'

import { neutralNetworkPaths, samplingClientPaths, modelSamplePaths } from '../layout/AppRouter' // comes from api in future
import { Space } from 'antd'

const Dashboard = () => {
  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <CoreCard info={<CoreCodeComment code='You can train a model, start by adding a neural network.' />} />

      <ListNeuralNetworks paths={neutralNetworkPaths} />
      <ListSamplingClients paths={samplingClientPaths} />
      <ListModelSamples paths={modelSamplePaths} />
    </Space>
  )
}

export default Dashboard

// import Iframe from 'react-iframe'
// const CoreIframe = ({ url }) => {
//   const frameBorder = 0
//   return (
//     <Iframe
//       url={url}
//       height={400}
//       position='inital'
//       scrolling='yes'
//       frameBorder={frameBorder}
//     />
//   )
// }

// <CoreIframes />
// const CoreIframes = () => {
//   const urls = [
//     'https://nodejavascript.com',
//     'https://georgefielder.com'
//   ]

//   return (
//     <Space>
//       {urls.map(url => <CoreIframe key={`iframe${url}`} url={url} />)}
//     </Space>
//   )
// }
