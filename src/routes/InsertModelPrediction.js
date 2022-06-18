import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useMutation, useQuery } from '@apollo/client'
import toObject from 'convert-to-object'
import useQueryParams from '@scaleway/use-query-params'

import InfoModelPrediction from '../models/InfoModelPrediction'
import CoreForm from '../components/CoreForm'

import { Form, Select, Input, Typography, Space } from 'antd'

const predictionInput = '{ r: 0, g: 0, b: 0 }'
const predictionOutput = '[ 1 ]'

export const QUERY_MODEL_PREDICTION_DEPENDENCIES = gql`
  query queryProfile {
    profile {
      neuralNetworks {
        id
        key
        name
        apiKey
        apiKeyExpired
      }
      samplingClients {
        id
        key
        name
        userAgent
      }
    }
}
`

const INSERT_MODEL_PREDICTION = gql`
  mutation insertModelPredictionMutation ($insertModelPredictionInput: InsertModelPredictionInput!) {
    insertModelPrediction (insertModelPredictionInput: $insertModelPredictionInput) {
      id
    }
  }
`

export const FormModelPrediction = ({ record, neuralNetworks, samplingClients }) => {
  return (
    <>

      {
        !record && (
          <>
            <Form.Item
              name='apiKey'
              label='Neural Network'
            >
              <Select>
                {
                  neuralNetworks.map(neuralNetwork => {
                    const { key, name, apiKey, apiKeyExpired } = neuralNetwork

                    return (
                      <Select.Option key={key} value={apiKey}>
                        {name}
                        {
                          apiKeyExpired && 'API KEY EXPIRED'
                        }
                      </Select.Option>
                    )
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item
              name='samplingclientId'
              label='Client'
            >
              <Select>
                {
                  samplingClients.map(samplingClient => {
                    const { id, key, name } = samplingClient
                    return (
                      <Select.Option key={key} value={id}>
                        {name}
                      </Select.Option>
                    )
                  })
                }
              </Select>
            </Form.Item>
          </>
        )

      }

      <Form.Item
        name='input'
        label={
          <Space>
            input
            <Typography.Text type='secondary' italic>{predictionInput}</Typography.Text>
          </Space>
        }
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        name='output'
        label={
          <Space>
            output
            <Typography.Text type='secondary' italic>{predictionOutput}</Typography.Text>
          </Space>
        }
      >
        <Input.TextArea />
      </Form.Item>
    </>
  )
}

const InsertModelPrediction = ({ paths }) => {
  const { queryParams } = useQueryParams()

  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { cardPath } = paths

  const { data: depData, loading: depLoading, error: depError } = useQuery(QUERY_MODEL_PREDICTION_DEPENDENCIES)

  const [insertModelPredictionMutation, { data, loading, error }] = useMutation(INSERT_MODEL_PREDICTION)

  useEffect(() => {
    if (!data?.insertModelPrediction) return
    navigate(`${cardPath}/${data.insertModelPrediction.id}`, { replace: true })
  }, [data, navigate, cardPath])

  const neuralNetworks = depData?.profile?.neuralNetworks || []
  const samplingClients = depData?.profile?.samplingClients || []

  return (
    <CoreForm
      info={<InfoModelPrediction />}
      record={queryParams}
      queryLoading={depLoading}
      queryError={depError}
      form={form}
      loading={loading}
      error={error}
      paths={paths}
      onFinish={values => {
        const input = values.input && toObject(values.input)
        const output = values.output && JSON.parse(values.output)

        return insertModelPredictionMutation({
          variables: {
            insertModelPredictionInput: { ...values, input, output }
          }
        })
      }}
    >
      <FormModelPrediction neuralNetworks={neuralNetworks} samplingClients={samplingClients} />
    </CoreForm>
  )
}

export default InsertModelPrediction
