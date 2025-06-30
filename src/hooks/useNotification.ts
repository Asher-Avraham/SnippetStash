import { useState, useCallback } from 'react'

type NotificationType = 'success' | 'error' | 'info'

interface Notification {
  id: string
  type: NotificationType
  message: string
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    const notification = { id, type, message }
    
    setNotifications(prev => [...prev, notification])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
    
    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const success = useCallback((message: string) => addNotification('success', message), [addNotification])
  const error = useCallback((message: string) => addNotification('error', message), [addNotification])
  const info = useCallback((message: string) => addNotification('info', message), [addNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info
  }
}