import { CellName, CellStatus, CellDates } from './cells'

export const returnWrappedCoreColumns = (columns, cardPath) => {
  return [
    {
      title: 'Name',
      key: 'name',
      render: record => <CellName record={record} cardPath={cardPath} />,
      sorter: (a, b) => a?.name && a.name.localeCompare(b?.name)
    },
    ...columns,
    {
      title: 'Status',
      key: 'enabled',
      render: record => <CellStatus record={record} />,
      sorter: (a, b) => a?.archived && a.archived.localeCompare(b?.archived)
    },
    {
      title: 'Updated',
      key: 'updatedAtAgo',
      render: record => <CellDates record={record} />,
      sorter: (a, b) => a?.updatedAtUnix && a.updatedAtUnix.localeCompare(b?.updatedAtUnix)
    }
  ]
}
