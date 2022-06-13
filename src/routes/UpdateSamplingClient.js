import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gql, useQuery, useMutation } from '@apollo/client'

import InfoSamplingClient from '../models/InfoSamplingClient'
import CoreForm from '../components/CoreForm'

import { Form, message } from 'antd'

import { QUERY_SAMPLING_CLIENT } from './CardSamplingClient'

const UPDATE_SAMPLING_CLIENT = gql`
  mutation updateSamplingClientMutation ($updateSamplingClientInput: UpdateSamplingClientInput!) {
    updateSamplingClient (updateSamplingClientInput: $updateSamplingClientInput) {
      id
    }
  }
`

const UpdateSamplingClient = ({ paths, hideTitle }) => {
  const { samplingclientId } = useParams()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { cardPath } = paths

  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(QUERY_SAMPLING_CLIENT, { variables: { querySamplingClientInput: { samplingclientId } } })

  const [updateSamplingClientMutation, { data, loading, error }] = useMutation(UPDATE_SAMPLING_CLIENT)

  useEffect(() => {
    if (data?.updateSamplingClient) {
      message.success('SAVED')
      navigate(`${cardPath}/${data.updateSamplingClient.id}`, { replace: true })
    }
  }, [data, navigate, cardPath])

  const record = queryData?.samplingClient

  return (
    <CoreForm
      info={<InfoSamplingClient record={record} />}
      queryLoading={queryLoading}
      queryError={queryError}
      record={record}
      form={form}
      loading={loading}
      error={error}
      paths={paths}
      onFinish={values => updateSamplingClientMutation({
        variables: {
          updateSamplingClientInput: { ...values, samplingclientId }
        }
      })}
      hideTitle={hideTitle}
    />
  )
}

export default UpdateSamplingClient
