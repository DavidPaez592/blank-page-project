import { notification } from 'antd'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

export const createNotification = (
  type: NotificationType,
  message: string,
  description: string
): void => {
  notification[type]({
    description,
    message,
  })
}
