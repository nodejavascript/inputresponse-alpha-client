import React, { useRef, useEffect, useState } from 'react'

import CoreCard from '../components/CoreCard'

const returnHue = hue => {
  return `hsl(${hue}, 100%, 50%)`
}

const Canvas = () => {
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const [isDrawing, setIsDrawing] = useState()
  const [hue, setHue] = useState()

  useEffect(() => {
    if (!hue) return setHue(44)
    if (hue > 255) return setHue(0)
  }, [hue])

  useEffect(() => {
    if (!isDrawing) return setHue(Math.random() * 255)
  }, [isDrawing])

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2
    canvas.style.width = '100%'
    canvas.style.height = '100%'

    const context = canvas.getContext('2d')
    context.scale(2, 2)
    context.lineCap = 'butt'
    context.strokeStyle = 'white'
    context.lineWidth = 1
    contextRef.current = context
  }, [])

  const mouseDown = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent
    const { current } = contextRef

    current.strokeStyle = returnHue(hue)
    current.beginPath()
    current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const mouseUp = () => {
    const { current } = contextRef
    current.closePath()
    setIsDrawing(false)
  }

  const mouseMove = ({ nativeEvent }) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = nativeEvent
    const { current } = contextRef
    current.lineTo(offsetX, offsetY)
    current.stroke()
  }

  return (
    <CoreCard>
      <canvas
        style={{
          border: '1px solid blue',
          backgroundColor: 'black'
        }}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onMouseMove={mouseMove}
        ref={canvasRef}
      />
    </CoreCard>
  )
}

export default Canvas
