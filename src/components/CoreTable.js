import React from 'react'

import { returnWrappedCoreColumns } from './table'

import CoreCardTitle from './CoreCardTitle'
import ErrorQuery from './ErrorQuery'
import CoreCodeComment from './CoreCodeComment'

import { Card, Table, Space } from 'antd'

const pagination = {
  showSizeChanger: true,
  position: ['bottomRight']
}
const scroll = { x: 700 }
const size = 'small'

const CoreTable = ({ dataSource, specificColumns, loading, error, paths }) => {
  if (error) return <ErrorQuery error={error} />

  const { cardPath, display = { } } = paths
  const { info } = display

  const columns = returnWrappedCoreColumns(specificColumns, cardPath)

  return (
    <Card
      title={<CoreCardTitle paths={paths} />}
      loading={loading}
    >
      <Space direction='vertical' size='large' style={{ width: '100%' }}>

        <CoreCodeComment code={info} />

        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          scroll={scroll}
          size={size}
        />

      </Space>
    </Card>
  )
}

export default CoreTable
