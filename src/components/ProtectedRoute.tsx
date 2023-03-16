import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'

type ProtectedRouteProps = {
  children: ReactElement
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)

  if (!token) {
    return <Navigate to="/" />
  }
  return children
}
