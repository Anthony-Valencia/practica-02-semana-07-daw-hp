import { useState, useEffect, useCallback, useRef } from 'react'

export default function useLocalStorage(key, defaultValue) {
  const isFirstRender = useRef(true)

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error leyendo localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.warn(`Error guardando en localStorage key "${key}":`, error)
      }
      return valueToStore
    })
  }, [key])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue))
      } catch (error) {
        console.warn(`Error inicial en localStorage key "${key}":`, error)
      }
    }
  }, [key, storedValue])

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch {
          setStoredValue(e.newValue)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}