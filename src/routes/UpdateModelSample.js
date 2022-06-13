import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gql, useQuery, useMutation } from '@apollo/client'
import toObject from 'convert-to-object'
import CoreForm from '../components/CoreForm'
import { QUERY_MODEL_SAMPLE_DEPENDENCIES, FormModelSample } from './InsertModelSample'
import { QUERY_MODEL_SAMPLE } from './CardModelSample'

import { Form, message } from 'antd'

const UPDATE_MODEL_SAMPLE = gql`
  mutation updateModelSampleMutation ($updateModelSampleInput: UpdateModelSampleInput!) {
    updateModelSample (updateModelSampleInput: $updateModelSampleInput) {
      id
    }
  }
`

const UpdateModelSample = ({ paths, hideTitle }) => {
  const { modelsampleId } = useParams()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { cardPath } = paths

  const { data: depData, loading: depLoading, error: depError } = useQuery(QUERY_MODEL_SAMPLE_DEPENDENCIES)
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(QUERY_MODEL_SAMPLE, { variables: { queryModelSampleInput: { modelsampleId } } })

  const [updateModelSampleMutation, { data, loading, error }] = useMutation(UPDATE_MODEL_SAMPLE)

  useEffect(() => {
    if (data?.updateModelSample) {
      message.success('SAVED')
      navigate(`${cardPath}/${data.updateModelSample.id}`, { replace: true })
    }
  }, [data, navigate, cardPath])

  const record = queryData?.modelSample

  const neuralNetworks = depData?.profile?.neuralNetworks || []
  const samplingClients = depData?.profile?.samplingClients || []

  return (
    <CoreForm
      queryLoading={queryLoading || depLoading}
      queryError={queryError || depError}
      record={record}
      form={form}
      loading={loading}
      error={error}
      paths={paths}
      onFinish={values => {
        const input = values.input && toObject(values.input)
        const output = values.output && JSON.parse(values.output)

        return updateModelSampleMutation({
          variables: {
            updateModelSampleInput: { ...values, input, output, modelsampleId }
          }
        })
      }}
      hideTitle={hideTitle}
    >
      <FormModelSample record={record} neuralNetworks={neuralNetworks} samplingClients={samplingClients} />
    </CoreForm>
  )
}

export default UpdateModelSample
