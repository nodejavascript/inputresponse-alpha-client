import React from 'react'

import { returnWrappedCoreColumns } from './table'

import CoreCardTitle from './CoreCardTitle'
import ErrorQuery from './ErrorQuery'

import { Card, Table } from 'antd'

const pagination = {
  showSizeChanger: true,
  position: ['bottomRight']
}
const scroll = { x: 700 }
const size = 'small'

const CoreTable = ({ dataSource, specificColumns, loading, error, paths }) => {
  if (error) return <ErrorQuery error={error} />

  const { cardPath } = paths

  const columns = returnWrappedCoreColumns(specificColumns, cardPath)

  return (
    <Card
      title={<CoreCardTitle paths={paths} />}
      loading={loading}
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        scroll={scroll}
        size={size}
      />
    </Card>
  )
}

export default CoreTable
