import { toast } from 'react-hot-toast'
import { JWT_TOKEN_KEY_NAME } from './constants'

export type RequestNotificationHandlerProps = {
  data?: any
  success: boolean
  message?: string
  errorCode?: number
}

export function requestNotificationHandler(
  result: RequestNotificationHandlerProps,
) {
  if (result.message) {
    if (result.success) {
      toast.success(result.message, {
        position: 'top-right',
      })
    } else {
      if (result.errorCode === 401) {
        localStorage.removeItem(JWT_TOKEN_KEY_NAME)
        window.location.reload()
      }
      toast.error(result.message, {
        position: 'top-right',
      })
    }
  }
}
