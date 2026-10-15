import { createContext, useState, useCallback, useContext, useRef, useEffect } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const timersRef = useRef(new Map())

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const notify = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = crypto.randomUUID()
      setNotifications((prev) => [...prev, { id, message, type }])
      if (duration > 0) {
        const timer = setTimeout(() => removeNotification(id), duration)
        timersRef.current.set(id, timer)
      }
      return id
    },
    [removeNotification]
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const value = { notifications, notify, removeNotification }
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications debe usarse dentro de NotificationProvider')
  return ctx
}

export default NotificationContext