import React, { useEffect } from 'react'

import CoreCodeComment from './CoreCodeComment'

import { Typography, message } from 'antd'
import { SnippetsTwoTone } from '@ant-design/icons'

const { Text } = Typography

const CoreCopyToClipboard = ({ field, text }) => {
  useEffect(() => {
    if (!text) return message.error(`no text to copy field ${field}`)
  }, [field, text])

  const icon = <SnippetsTwoTone />

  // const onClickedCopy = args => {
  //   console.log('args', args)
  //   message.success('Copied!')
  // }

  return (
    // <Text copyable={{ text, icon, tooltips: false }} onClick={onClickedCopy}>
    // where is the copied! callback?
    <Text copyable={{ text, icon }}>
      Copy <CoreCodeComment code={field} /> to clipboard
    </Text>
  )
}

export default CoreCopyToClipboard
