import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'

import CoreForm from '../components/CoreForm'

import { Form } from 'antd'

const INSERT_SAMPLING_CLIENT = gql`
  mutation insertSamplingClientMutation ($insertSamplingClientInput: InsertSamplingClientInput!) {
    insertSamplingClient (insertSamplingClientInput: $insertSamplingClientInput) {
      id
    }
  }
`

const InsertSamplingClient = ({ paths }) => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { cardPath } = paths

  const [insertSamplingClientMutation, { data, loading, error }] = useMutation(INSERT_SAMPLING_CLIENT)

  useEffect(() => {
    if (!data?.insertSamplingClient) return
    navigate(`${cardPath}/${data.insertSamplingClient.id}`, { replace: true })
  }, [data, navigate, cardPath])

  return (
    <CoreForm
      form={form}
      loading={loading}
      error={error}
      paths={paths}
      onFinish={values => insertSamplingClientMutation({
        variables: {
          insertSamplingClientInput: values
        }
      })}
    />
  )
}

export default InsertSamplingClient
