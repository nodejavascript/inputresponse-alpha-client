import React from 'react'
import { useLocation } from 'react-router-dom'

import { returnCurrentRoute } from '../layout/AppRouter'
import SimpleLink from './SimpleLink'

import { Space, Row, Col } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'

export const RouteTitle = ({ paths }) => {
  const { pathname } = useLocation()
  const { title } = returnCurrentRoute(pathname)
  return paths?.display?.plural || title
}

const CoreCardTitle = ({ paths, id }) => {
  if (!paths || paths?.profile) return <RouteTitle />

  const { listPath, insertPath, display = { } } = paths
  const { singular, plural } = display

  // rules til api does better
  const ListButton = () => {
    if (!listPath || !plural) return null
    return (
      <SimpleLink
        to={listPath}
        type='default'
        shape='square'
        content={<UnorderedListOutlined />}
      />
    )
  }
  const InsertButton = () => {
    if (!insertPath || !singular) return null
    return (
      <SimpleLink
        to={insertPath}
        type='primary'
        shape='square'
        ghost='true'
        content='Insert'
      />
    )
  }

  if (!ListButton && !InsertButton) return <RouteTitle paths={paths} />

  return (
    <Row justify='space-between'>
      <Col>
        <Space>
          <ListButton />
          <RouteTitle paths={paths} />
        </Space>
      </Col>
      <Col>
        <InsertButton />
      </Col>
    </Row>

  )
}

export default CoreCardTitle

// {/* <CordCardPopover title={<RouteTitle />} buttons={buttons} /> */}
// const buttons = []
// const CordCardPopover = ({ title, buttons }) =>
//
//   listButton && buttons.push({
//     to: listPath,
//     content: `List ${plural}`,
//     icon: <UnorderedListOutlined />
//   })
//
//   insertButton && buttons.push({
//     to: insertPath,
//     content: `Insert ${singular}`,
//     type: 'primary',
//     icon: <PlusOutlined />
//   })
//
//
//   const [visible, setVisible] = useState(false)
//
//   const handleVisibleChange = (newVisible) => {
//     setVisible(newVisible)
//   }
//
//   return (
//     <Popover
//       content={
//         <Space>
//           <Buttons buttons={buttons} />
//
//         </Space>
//       }
//       title={
//         <Row justify='space-between' align='middle'>
//           <Col>
//             Options
//           </Col>
//           <Col>
//             <Button type='link' onClick={() => setVisible(false)} style={{ padding: 0 }}>Close</Button>
//           </Col>
//         </Row>
//       }
//       trigger='click'
//       visible={visible}
//       onVisibleChange={handleVisibleChange}
//     >
//       <Button
//         type='default'
//         shape='square'
//         icon={<SettingTwoTone />}
//         size='large'
//         onClick={() => setVisible(!visible)}
//       />
//     </Popover>
//   )
// }
