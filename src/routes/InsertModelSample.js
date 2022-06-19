import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useMutation, useQuery } from '@apollo/client'
import toObject from 'convert-to-object'
import useQueryParams from '@scaleway/use-query-params'

import InfoModelSample from '../models/InfoModelSample'
import CoreForm from '../components/CoreForm'

import { Form, Select, Input, Typography, Space } from 'antd'

const sampleInput = '{ r: 0, g: 0, b: 0 }'
const sampleOutput = '[ 1 ]'

export const QUERY_MODEL_SAMPLE_DEPENDENCIES = gql`
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

export const INSERT_MODEL_SAMPLE = gql`
  mutation insertModelSampleMutation ($insertModelSampleInput: InsertModelSampleInput!) {
    insertModelSample (insertModelSampleInput: $insertModelSampleInput) {
      id
    }
  }
`

export const FormModelSample = ({ record, neuralNetworks, samplingClients }) => {
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
            <Typography.Text type='secondary' italic>{sampleInput}</Typography.Text>
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
            <Typography.Text type='secondary' italic>{sampleOutput}</Typography.Text>
          </Space>
        }
      >
        <Input.TextArea />
      </Form.Item>
    </>
  )
}

const InsertModelSample = ({ paths }) => {
  const { queryParams } = useQueryParams()

  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { cardPath } = paths

  const { data: depData, loading: depLoading, error: depError } = useQuery(QUERY_MODEL_SAMPLE_DEPENDENCIES)

  const [insertModelSampleMutation, { data, loading, error }] = useMutation(INSERT_MODEL_SAMPLE)

  useEffect(() => {
    if (!data?.insertModelSample) return
    navigate(`${cardPath}/${data.insertModelSample.id}`, { replace: true })
  }, [data, navigate, cardPath])

  const neuralNetworks = depData?.profile?.neuralNetworks || []
  const samplingClients = depData?.profile?.samplingClients || []

  return (
    <CoreForm
      info={<InfoModelSample />}
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

        return insertModelSampleMutation({
          variables: {
            insertModelSampleInput: { ...values, input, output }
          }
        })
      }}
    >
      <FormModelSample neuralNetworks={neuralNetworks} samplingClients={samplingClients} />
    </CoreForm>
  )
}

export default InsertModelSample
