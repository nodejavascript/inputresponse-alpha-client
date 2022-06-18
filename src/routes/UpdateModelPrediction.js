import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gql, useQuery, useMutation } from '@apollo/client'
import toObject from 'convert-to-object'

import InfoModelPrediction from '../models/InfoModelPrediction'
import CoreForm from '../components/CoreForm'

import { QUERY_MODEL_PREDICTION_DEPENDENCIES, FormModelPrediction } from './InsertModelPrediction'
import { QUERY_MODEL_PREDICTION } from './CardModelPrediction'

import { Form, message } from 'antd'

const UPDATE_MODEL_PREDICTION = gql`
  mutation updateModelPredictionMutation ($updateModelPredictionInput: UpdateModelPredictionInput!) {
    updateModelPrediction (updateModelPredictionInput: $updateModelPredictionInput) {
      id
    }
  }
`

const UpdateModelPrediction = ({ paths, hideTitle }) => {
  const { modelpredictionId } = useParams()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { cardPath } = paths

  const { data: depData, loading: depLoading, error: depError } = useQuery(QUERY_MODEL_PREDICTION_DEPENDENCIES)
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(QUERY_MODEL_PREDICTION, { variables: { queryModelPredictionInput: { modelpredictionId } } })

  const [updateModelPredictionMutation, { data, loading, error }] = useMutation(UPDATE_MODEL_PREDICTION)

  useEffect(() => {
    if (data?.updateModelPrediction) {
      message.success('SAVED')
      navigate(`${cardPath}/${data.updateModelPrediction.id}`, { replace: true })
    }
  }, [data, navigate, cardPath])

  const record = queryData?.modelPrediction

  const neuralNetworks = depData?.profile?.neuralNetworks || []
  const samplingClients = depData?.profile?.samplingClients || []

  return (
    <CoreForm
      info={<InfoModelPrediction record={record} />}
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

        return updateModelPredictionMutation({
          variables: {
            updateModelPredictionInput: { ...values, input, output, modelpredictionId }
          }
        })
      }}
      hideTitle={hideTitle}
    >
      <FormModelPrediction record={record} neuralNetworks={neuralNetworks} samplingClients={samplingClients} />
    </CoreForm>
  )
}

export default UpdateModelPrediction
