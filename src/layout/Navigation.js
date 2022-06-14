import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { navigationalRoutes } from './AppRouter'
import Auth from '../models/Auth'

import { Menu, Row, Col } from 'antd'

const Navigation = ({ children, user, pathname, auth }) => {
  const items = navigationalRoutes.map(({ path: key, title: label }) => ({ key, label }))

  const selectedKeysDefault = items.find(i => i.key === pathname)

  const navigate = useNavigate()
  const [selectedKeys, setSelectedKeys] = useState(selectedKeysDefault?.key)

  const onClick = ({ key }) => {
    if (key.charAt(0) !== '/') return
    navigate(key)
    setSelectedKeys(key)
  }

  useEffect(() => {
    if (pathname === '/' && selectedKeys === pathname) return
    return setSelectedKeys(pathname)
  }, [pathname, selectedKeys, setSelectedKeys])

  return (
    <Row justify='space-between'>
      <Col flex={1}>
        <Menu theme='dark' onClick={onClick} selectedKeys={[selectedKeys]} mode='horizontal' items={items} />
      </Col>
      <Col>
        <Auth user={user} />
      </Col>
    </Row>
  )
}

export default Navigation
