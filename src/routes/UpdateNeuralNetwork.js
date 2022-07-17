import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gql, useQuery, useMutation } from '@apollo/client'

import CoreForm from '../components/CoreForm'

import { Form, message } from 'antd'

import InfoNeuralNetwork from '../models/InfoNeuralNetwork'
import { QUERY_NEURAL_NETWORK } from './CardNeuralNetwork'

const UPDATE_NEURAL_NETWORK = gql`
  mutation updateNeuralNetworkMutation ($updateNeuralNetworkInput: UpdateNeuralNetworkInput!) {
    updateNeuralNetwork (updateNeuralNetworkInput: $updateNeuralNetworkInput) {
      id
    }
  }
`

const UpdateNeuralNetwork = ({ paths, hideTitle }) => {
  const { neuralnetworkId } = useParams()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { cardPath } = paths

  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(QUERY_NEURAL_NETWORK, { variables: { queryNeuralNetworkInput: { neuralnetworkId } } })

  const [updateNeuralNetworkMutation, { data, loading, error }] = useMutation(UPDATE_NEURAL_NETWORK)

  useEffect(() => {
    if (data?.updateNeuralNetwork) {
      message.success('SAVED')
      navigate(`${cardPath}/${data.updateNeuralNetwork.id}`, { replace: true })
    }
  }, [data, navigate, cardPath])

  const record = queryData?.neuralNetwork

  return (
    <CoreForm
      queryLoading={queryLoading}
      queryError={queryError}
      record={record}
      form={form}
      loading={loading}
      error={error}
      paths={paths}
      onFinish={values => updateNeuralNetworkMutation({
        variables: {
          updateNeuralNetworkInput: { ...values, neuralnetworkId }
        }
      })}
      hideTitle={hideTitle}
    />
  )
}

export default UpdateNeuralNetwork
