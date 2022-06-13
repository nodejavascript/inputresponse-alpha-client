import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useQuery, useMutation } from '@apollo/client'

import CoreForm from '../components/CoreForm'

import { Form, message } from 'antd'

import { QUERY_PROFILE } from './CardProfile'

const UPDATE_PROFILE = gql`
  mutation updateProfileMutation ($updateProfileInput: UpdateProfileInput!) {
    updateProfile (updateProfileInput: $updateProfileInput) {
      id
    }
  }
`

const UpdateProfile = ({ paths, hideTitle }) => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { cardPath } = paths

  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(QUERY_PROFILE)

  const [updateProfileMutation, { data, loading, error }] = useMutation(UPDATE_PROFILE)

  useEffect(() => {
    if (data?.updateProfile) {
      message.success('SAVED')
      navigate(cardPath, { replace: true })
    }
  }, [data, navigate, cardPath])

  const record = queryData?.profile

  return (
    <CoreForm
      queryLoading={queryLoading}
      queryError={queryError}
      record={record}
      form={form}
      loading={loading}
      error={error}
      paths={paths}
      onFinish={values => updateProfileMutation({
        variables: {
          updateProfileInput: values
        }
      })}
      hideTitle={hideTitle}
    />
  )
}

export default UpdateProfile
