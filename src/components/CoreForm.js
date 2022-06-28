import React from 'react'

import CoreCardTitle from './CoreCardTitle'
import ErrorQuery from './ErrorQuery'
import ErrorMessage from './ErrorMessage'
import SimpleLink from './SimpleLink'
import CoreCodeComment from './CoreCodeComment'

import { Form, Input, Switch, Button, Card, Space } from 'antd'

const defaultValues = { enabled: true }

const CoreForm = ({ children, queryLoading, queryError, info, record, form, loading, error, paths, onFinish, hideTitle }) => {
  const initialValues = { ...defaultValues, ...record }

  if (queryError) return <ErrorQuery error={queryError} />

  return (
    <Card
      title={!hideTitle && <CoreCardTitle id={record?.id} />}
      loading={queryLoading}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={initialValues}
        onFinish={values => onFinish(values)}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          {info}

          {
            children?.props && (
              <>
                <CoreCodeComment level={4} code='settings:' />
                {children}
              </>
            )
          }
        </Space>

        <CoreCodeComment level={4} code='form:' />

        <Form.Item
          name='name'
          label='name'
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='note'
          label='note'
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name='imageURL'
          label='imageURL'
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='enabled'
          label='enabled'
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name='archived'
          label='archived'
          valuePropName='checked'
          disabled
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit' loading={loading}>
              Save
            </Button>

            <SimpleLink
              to={paths?.listPath}
              content='Cancel'
              type='default'
            />
          </Space>
        </Form.Item>

        <ErrorMessage error={error} />



      </Form>
    </Card>
  )
}

export default CoreForm
