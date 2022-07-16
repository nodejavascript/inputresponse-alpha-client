import React, { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import ErrorMessage from './ErrorMessage'
import CoreCodeComment from './CoreCodeComment'
import CoreCopyToClipboard from './CoreCopyToClipboard'
import CellFormat from './table/CellFormat'

import { Button, Modal, Form, DatePicker, Switch, Alert, Space, Col, Divider } from 'antd'

const UPDATE_PROFILE = gql`
  mutation requestNewApiKeyMutation ($requestNewApiKeyInput: RequestNewApiKeyInput!) {
    requestNewApiKey (requestNewApiKeyInput: $requestNewApiKeyInput) {
      id
      apiKey
      apiKeyExpires
      apiKeyExpired
      apiKeyCreatedAgo
      apiKeyExpiresAgo
    }
  }
`

const RequestNewApiKey = ({ record }) => {
  const [form] = Form.useForm()

  const [requestNewApiKeyMutation, { data, loading, error }] = useMutation(UPDATE_PROFILE)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!data?.requestNewApiKey) return
    return setVisible(false)
  }, [data, setVisible])

  if (!record?.id) return null

  const handleSave = async () => {
    const values = form.getFieldsValue()
    const { id: neuralnetworkId } = record

    const variables = {
      requestNewApiKeyInput: { ...values, neuralnetworkId }
    }

    await requestNewApiKeyMutation({
      variables
    })
    return form.resetFields()
  }

  return (
    <>
      <Button type='link' onClick={() => setVisible(!visible)} style={{ padding: 0 }}>Update API key</Button>

      <Modal
        visible={visible}
        title={<CellFormat bottomRow={record?.name} topRow={<CoreCopyToClipboard field='apiKey' text={record?.apiKey} />} />}
        onCancel={() => setVisible(!visible)}
        footer={[
          <Button
            key='requestKeySave'
            type='primary'
            loading={loading}
            onClick={handleSave}
          >
            Save
          </Button>,
          <Button key='requestKeyCancel' onClick={() => setVisible(!visible)}>
            Close
          </Button>
        ]}
      >
        <Space direction='vertical' style={{ width: '100%' }}>

          <LabelApiKeyExpires record={record} />

          <Divider />

          <Form
            form={form}
            layout='vertical'
          >

            <Form.Item
              name='apiKeyExpires'
              label='Set new expiry'
            >
              <DatePicker showTime format='ddd, MMM D, YYYY H:mm:ss.SSS a' />
            </Form.Item>

            <Form.Item
              name='deleteExpiry'
              label='Remove expiry?'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name='resetApiKey'
              label='Generate new key?'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>

          </Form>

          <ErrorMessage error={error} />

        </Space>
      </Modal>
    </>
  )
}

export default RequestNewApiKey

const LabelApiKeyExpires = ({ record = { } }) => {
  const {
    apiKeyExpires,
    apiKeyExpired,
    apiKeyCreatedAgo,
    apiKeyExpiresAgo
  } = record

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      {
        apiKeyExpired
          ? <Alert banner type='error' message='Key expired' />
          : <Alert banner type='success' message='Key is valid' />
      }

      {
        apiKeyExpires
          ? <Alert banner type='info' message='Key will expire' />
          : <Alert banner type='warning' message='Key has no expiry date' />
      }

      {apiKeyExpiresAgo && <Alert banner type='info' message={`Expires ${apiKeyExpiresAgo}`} />}

      {
        apiKeyCreatedAgo &&
          <Alert
            banner
            type='info'
            message={
              <Col>
                <CoreCodeComment code='apiKey' /> created {apiKeyCreatedAgo}
              </Col>
            }
          />
      }

    </Space>
  )
}
