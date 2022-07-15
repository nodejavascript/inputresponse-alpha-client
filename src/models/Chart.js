// https://www.react-google-charts.com/examples/bubble-chart
// import { useTimeout } from './CustomHooks'
import React, { useEffect, useState } from 'react'
import { gql, useSubscription } from '@apollo/client'

import { CORE_QUERY_FIELDS } from '../lib'

import { Chart as GoogleChart } from 'react-google-charts'

// import ReactJson from 'react-json-view'

import { Spin, Space, Statistic, Typography } from 'antd'

const SUBSCRIPTION_SENSOR_DATA_INSERTED = gql`
  subscription mySubscription  ($subscriptionSensorDataInserted: SubscriptionSensorDataInserted!) {
    sensorDataInserted (subscriptionSensorDataInserted: $subscriptionSensorDataInserted) {
      ${CORE_QUERY_FIELDS}
      topic
      payload
    }
  }
`

const scatterHeader = ['Current', 'Voltage']

const scatterOptionsInit = {
  title: 'Voltage vs. Current comparison',
  hAxis: { title: 'Current', minValue: 0, maxValue: 0 },
  vAxis: { title: 'Voltage', minValue: 0, maxValue: 0 },
  legend: 'none',
  pointSize: 6,
  width: '100%'
}

const guagesHeader = ['Label', 'Value']
const guageOptions = { height: 240 }

const optionsCurrent = {
  ...guageOptions,
  max: 0.001
}

const optionsVoltage = {
  ...guageOptions,
  max: 0.001
}

const topic = 'tele/nodejavascriptSensorDemo/SENSOR'

const Chart = ({ something }) => {
  const { data: subscription } = useSubscription(SUBSCRIPTION_SENSOR_DATA_INSERTED, { variables: { subscriptionSensorDataInserted: { topic } } })

  const [data, setData] = useState()
  const [record, setRecord] = useState()
  const [guageCurrent, setGuageCurrent] = useState()
  const [guageVoltage, setGuageVoltage] = useState()
  const [scatterOptions, setOptionsVoltage] = useState(scatterOptionsInit)

  useEffect(() => {
    if (!record) return
    const [current, voltage] = record

    const maxCurrent = scatterOptions.hAxis.maxValue
    const maxVoltage = scatterOptions.vAxis.maxValue

    if (current > maxCurrent || voltage > maxVoltage) {
      const settings = { ...scatterOptions }
      if (current > maxCurrent) settings.hAxis.maxValue = current
      if (voltage > maxVoltage) settings.vAxis.maxValue = voltage

      setOptionsVoltage(settings)
    }

    setGuageCurrent([guagesHeader, ['Current', record[0]]])
    return setGuageVoltage([guagesHeader, ['Voltage', record[1]]])
  }, [record, scatterOptions, setOptionsVoltage, setGuageCurrent, setGuageVoltage])

  useEffect(() => {
    if (!record) return
    if (!data) return setData([scatterHeader, record])
    if (data) return setData([...data, record])
  }, [record, setData])

  useEffect(() => {
    if (!subscription?.sensorDataInserted?.payload) return

    const { INA219 } = subscription.sensorDataInserted.payload
    const { Voltage, Current } = INA219

    const record = [Current, Voltage]
    return setRecord(record)
  }, [subscription, setRecord])

  return (
    <Space direction='vertical' aling='center' style={{ width: '100%' }}>

      <Typography.Title level={3}>INA219 Bi-Direction DC Current Power Supply Breakout Sensor</Typography.Title>

      {
        !data &&
          <Space>
            <Spin />
            Subscribing...
          </Space>
      }

      <Space>

        <GoogleChart
          chartType='Gauge'
          data={guageCurrent}
          options={optionsCurrent}
        />

        <GoogleChart
          chartType='Gauge'
          data={guageVoltage}
          options={optionsVoltage}
        />

      </Space>

      <Statistic title='Points plotted' value={data?.length - 1 || 0} />
      <GoogleChart
        chartType='ScatterChart'
        data={data}
        width='100%'
        height='600px'
        options={scatterOptions}
      />

    </Space>
  )
}

export default Chart
