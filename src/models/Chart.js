// https://www.react-google-charts.com/examples/bubble-chart
// import { useTimeout } from './CustomHooks'
import React, { useEffect } from 'react'
import { gql, useSubscription } from '@apollo/client'

// import { CORE_QUERY_FIELDS } from '../lib'

// import { Chart as GoogleChart } from 'react-google-charts'

import { Spin } from 'antd'

const SUBSCRIPTION_SENSOR_DATA_INSERTED = gql`
  subscription mySubscription {
    sensorDataInserted {

      topic
      payload
    }
  }
`

// SW-420 Motion Sensor Module : ANALOG.A0
// INA219 Bi-Direction DC Current Power Supply Breakout Sensor

// const topic = 'tele/nodejavascriptSensorDemo/SENSOR'
// const variables = { subscriptionSensorDataInserted: { topic } }
// console.log('variables', variables)

// const header = [
//   [
//     { type: 'date', label: 'Day' },
//     'Voltage',
//     'Current'
//   ]
// ]

// const options = {
//   chart: {
//     title: 'Power usage'
//   },
//   width: 900,
//   height: 500,
//   series: {
//     // Gives each series an axis name that matches the Y-axis below.
//     0: { axis: 'Voltage' },
//     1: { axis: 'Current' }
//   },
//   axes: {
//     // Adds labels to each axis; they don't have to match the axis names.
//     y: {
//       Voltage: { label: 'V' },
//       Current: { label: 'A' }
//     }
//   }
// }

const Chart = ({ something }) => {
  const { loading, error, data: subscription } = useSubscription(SUBSCRIPTION_SENSOR_DATA_INSERTED)

  // const [data, setData] = useState()

  useEffect(() => {
    if (subscription) console.log('subscription', subscription)
  }, [subscription])

  // useEffect(() => {
  //   console.log('loading', loading)
  // }, [loading])
  //
  // useEffect(() => {
  //   if (error) console.log('subscription', subscription)
  //   console.log('error', error)
  // }, [error])

  if (loading) return <Spin size='large' />
  if (subscription) return <>subscription</>

  // return (
  //   <GoogleChart
  //     chartType='Line'
  //     data={data}
  //     width='100%'
  //     height='600px'
  //     options={options}
  //   />
  // )
}

export default Chart
