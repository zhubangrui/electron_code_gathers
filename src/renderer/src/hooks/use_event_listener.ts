import { useEffect } from 'react'

const useEventListener = (type: keyof WindowEventMap, fn): void => {
  useEffect(() => {
    window.addEventListener(type, fn)
    return () => window.removeEventListener(type, fn)
  }, [fn])
}

export default useEventListener
