import React from 'react'

import CoreCard from '../components/CoreCard'
import CoreCodeComment from '../components/CoreCodeComment'

const Dashboard = () => <CoreCard info={<CoreCodeComment code='You can train a model, start by adding a neural network.' />} />

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
