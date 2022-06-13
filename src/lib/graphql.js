// leave model unique fields in components for ease of reference for new developer eyes

export const CORE_MUTABBLE_FIELDS = `
  name
  note
  imageURL
  enabled
  archived
`

export const CORE_QUERY_FIELDS = `
  ${CORE_MUTABBLE_FIELDS}
  id
  key

  createdAtAgo
  updatedAtAgo
  createdAt
  updatedAt
  createdAtUnix
  updatedAtUnix
`
