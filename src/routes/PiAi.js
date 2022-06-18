import React, { useRef, useEffect } from 'react'

import CenterContent from '../components/CenterContent'

import { Space, Card } from 'antd'

const style = {
  width: '100%',
  border: '1px solid black',
  backgroundColor: '#fafafa'
}

const PiAi = () => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    console.log('max width', canvas.width)
    console.log('max height', canvas.height)
  }, [])

  // const mouseDown = ({ nativeEvent }) => {
  //   const { offsetX, offsetY } = nativeEvent
  //   const { current } = contextRef
  //
  //   current.strokeStyle = returnHue(hue)
  //   current.beginPath()
  //   current.moveTo(offsetX, offsetY)
  //   setIsDrawing(true)
  // }

  return (
    <CenterContent>
      <Space direction='vertical'>
        <Card
          title='Controls'
        >
          control panel
        </Card>

        <Card
          title='Canvas 2d'
        >
          <canvas
            ref={canvasRef}
            style={style}
          />
        </Card>
      </Space>
    </CenterContent>
  )
}

export default PiAi
