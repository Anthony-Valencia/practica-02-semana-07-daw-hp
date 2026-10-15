import { useNotifications } from '../contexts/NotificationContext'

export default function Notifications() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="notifications-container">
      {notifications.map((n) => (
        <div key={n.id} className={`notification notification-${n.type}`}>
          <span className="notification-icon">
            {n.type === 'success' && '✅'}
            {n.type === 'error' && '❌'}
            {n.type === 'warning' && '⚠️'}
            {n.type === 'info' && 'ℹ️'}
          </span>
          <span className="notification-message">{n.message}</span>
          <button
            className="notification-close"
            onClick={() => removeNotification(n.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}