import { useRef, useEffect } from 'react'

/*
  credit: https://www.joshwcomeau.com/snippets/react-hooks/use-timeout/

  usage:
  const [hasTimeElapsed, setHasTimeElapsed] = useState()

  useTimeout(() => {
    setHasTimeElapsed(true)
  }, hasTimeElapsed ? null : interval)

*/

export const useTimeout = (callback, delay) => {
  const timeoutRef = useRef(null)
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => savedCallback.current()

    if (typeof delay === 'number') {
      timeoutRef.current = window.setTimeout(tick, delay)
      return () => window.clearTimeout(timeoutRef.current)
    }
  }, [delay])
  return timeoutRef
}
