import { toast } from 'react-hot-toast'

import { JWT_TOKEN_KEY_NAME } from './constants'
import { env } from '../env'
import { refreshToken } from '../services/AuthService'

export type RequestNotificationHandlerProps = {
  data?: any
  success: boolean
  message?: string
  errorCode?: number
}

export async function requestNotificationHandler(
  result: RequestNotificationHandlerProps,
) {
  if (result.message) {
    if (result.success) {
      toast.success(result.message, {
        position: 'top-right',
      })
    } else {
      if (result.errorCode === 401) {
        handleUnauthorized()
      }
      toast.error(result.message, {
        position: 'top-right',
      })
    }
  } else {
    if (result.errorCode === 401) {
      handleUnauthorized()
    }
  }
}

async function handleUnauthorized() {
  if (env.MODE === 'development') {
    localStorage.removeItem(JWT_TOKEN_KEY_NAME)
    return window.location.reload()
  }
  const newToken = await refreshToken()
  if (!newToken) {
    localStorage.removeItem(JWT_TOKEN_KEY_NAME)
    return window.location.reload()
  }
  localStorage.setItem(JWT_TOKEN_KEY_NAME, newToken)
}
