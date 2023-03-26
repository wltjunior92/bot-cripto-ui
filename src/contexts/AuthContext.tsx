import { createContext, ReactNode, useEffect, useState } from 'react'

import { UserDTO } from '../dtos/userDTO'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getUserData } from '../services/UserDataService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'

type AuthContextDataProps = {
  user: UserDTO | null
  clearUser: () => void
  handleGetUserData: (token: string) => Promise<void>
  setUserAction: (user: UserDTO) => void
  setIsLoggedInAction: (value: boolean) => void
  isLoggedIn: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthProvider({ children }: AuthContextProviderProps) {
  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserDTO | null>(null)

  function clearUser() {
    setUser(null)
  }

  function setUserAction(user: UserDTO) {
    setUser(user)
  }

  async function handleGetUserData(token: string) {
    const user: UserDTO = await getUserData(token)
    if (user) {
      setUser(user)
    } else {
      setUser(null)
    }
  }

  function setIsLoggedInAction(value: boolean) {
    setIsLoggedIn(value)
  }

  useEffect(() => {
    const path = window.location.pathname
    if (path !== '/') {
      handleGetUserData(token)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        clearUser,
        handleGetUserData,
        setUserAction,
        setIsLoggedInAction,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
