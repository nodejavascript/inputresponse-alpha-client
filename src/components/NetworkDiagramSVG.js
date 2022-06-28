import React from 'react'

const NetworkDiagramSVG = ({ record }) => {
  if (!record?.diagram) return null

  return (
    <div>
      <img src={`data:image/svg+xml;utf8,${record.diagram}`} />
    </div>
  )
}

export default NetworkDiagramSVG
