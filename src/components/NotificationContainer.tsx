import React from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface NotificationContainerProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-900 border-green-700'
      case 'error':
        return 'bg-red-900 border-red-700'
      case 'info':
        return 'bg-blue-900 border-blue-700'
      default:
        return 'bg-blue-900 border-blue-700'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center p-4 rounded-lg border ${getBackgroundColor(notification.type)} shadow-lg animate-in slide-in-from-right-full duration-300`}
        >
          {getIcon(notification.type)}
          <p className="ml-3 text-sm text-white flex-1">{notification.message}</p>
          <button
            onClick={() => onRemove(notification.id)}
            className="ml-4 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}