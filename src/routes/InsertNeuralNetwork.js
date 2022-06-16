import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'

import CoreForm from '../components/CoreForm'

import InfoNeuralNetwork from '../models/InfoNeuralNetwork'

import { Form } from 'antd'

const INSERT_NEURAL_NETWORK = gql`
  mutation insertNeuralNetworkMutation ($insertNeuralNetworkInput: InsertNeuralNetworkInput!) {
    insertNeuralNetwork (insertNeuralNetworkInput: $insertNeuralNetworkInput) {
      id
    }
  }
`

const InsertNeuralNetwork = ({ paths }) => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { cardPath } = paths

  const [insertNeuralNetworkMutation, { data, loading, error }] = useMutation(INSERT_NEURAL_NETWORK)

  useEffect(() => {
    if (!data?.insertNeuralNetwork) return
    navigate(`${cardPath}/${data.insertNeuralNetwork.id}`, { replace: true })
  }, [data, navigate, cardPath])

  return (
    <CoreForm
      info={<InfoNeuralNetwork />}
      form={form}
      loading={loading}
      error={error}
      paths={paths}
      onFinish={values => insertNeuralNetworkMutation({
        variables: {
          insertNeuralNetworkInput: values
        }
      })}
    />
  )
}

export default InsertNeuralNetwork
