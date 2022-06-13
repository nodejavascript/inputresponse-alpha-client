import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

const SimpleLink = ({ to, tab, content, type = 'link', loading, style, block, shape, ghost }) => {
  if (tab) {
    const onClick = () => window.open(tab)
    return (
      <Button type={type} onClick={onClick} style={style} block={block}>
        {content}
      </Button>
    )
  }

  if (to) {
    return (
      <Link to={to}>
        <Button type={type} style={style} block={block} shape={shape} ghost={ghost}>
          {content}
        </Button>
      </Link>
    )
  }
}

export default SimpleLink
