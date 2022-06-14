import React from 'react'
import { useLocation } from 'react-router-dom'

import { useReactiveVar } from '@apollo/client'
import { memoryUser } from '../lib/apolloReactiveVars'

import Navigation from './Navigation'
import AuthenticationRequired from './AuthenticationRequired'

import { Layout, Space } from 'antd'

const { Header, Content } = Layout

const Frame = ({ returnCurrentRoute, children }) => {
  const user = useReactiveVar(memoryUser)
  const { pathname } = useLocation()

  const currentRoute = returnCurrentRoute(pathname)
  if (!currentRoute) return children

  // nice to have to creating breadcrumb
  const { auth, title } = currentRoute

  document.title = title

  const childrenGateway = auth && !user ? <AuthenticationRequired /> : children

  return (
    <Layout style={{ backgroundColor: 'black' }}>
      <Header>
        <Navigation user={user} pathname={pathname} auth={auth} />
      </Header>

      <Content style={{ padding: '0px 12px 12px 12px' }}>
        <Space direction='vertical' style={{ width: '100%' }}>
          {/*
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
          */}
          <>
            {childrenGateway}
          </>
        </Space>
      </Content>

    </Layout>
  )
}

export default Frame

// <Content
//   style={{
//     paddingLeft: '24px',
//     paddingRight: '24px',
//     paddingBottom: '24px'
//   }}
// >
//   {childrenGateway}
// </Content>
