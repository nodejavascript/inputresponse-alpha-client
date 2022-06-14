import React from 'react'
import SimpleLink from './SimpleLink'
import ErrorMessage from './ErrorMessage'

import CoreCard from './CoreCard'

import { Result, Typography } from 'antd'
const { Paragraph, Text } = Typography

const { REACT_APP_ISSUES_URL } = process.env

const ErrorQuery = ({ error }) => {
  return (
    <CoreCard info={

      <Result
        status='error'
        title='Query Failed'
        subTitle='If you believe you can fix this error, study the details below with your console (ALT-SHIFT-J)'
        extra={[
          <SimpleLink key='reportissue' tab={REACT_APP_ISSUES_URL} content='Report issue 👍' loading type='primary' />,
          <SimpleLink key='gotoroot' to='/' content='Go back Home' />
        ]}
      >
        <div className='desc'>
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16
              }}
            >
              The content you requested has the following error:
            </Text>
          </Paragraph>
          <Paragraph>
            <ErrorMessage error={error} />
          </Paragraph>
          <Paragraph>
            <pre style={{ fontSize: 10 }}>
              {JSON.stringify(error, null, 2)}
            </pre>
          </Paragraph>
        </div>
      </Result>

      }
    />
  )
}

export default ErrorQuery
