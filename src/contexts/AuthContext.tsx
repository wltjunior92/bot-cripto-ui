import { createContext, ReactNode, useState } from 'react'
import { UserDTO } from '../dtos/userDTO'
import { getUserData } from '../services/UserDataService'

type AuthContextDataProps = {
  user: UserDTO | null
  clearUser: () => void
  handleGetUserData: (token: string) => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO | null>(null)

  function clearUser() {
    setUser(null)
  }

  async function handleGetUserData(token: string) {
    const user: UserDTO = await getUserData(token)
    if (user) {
      setUser(user)
    } else {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, clearUser, handleGetUserData }}>
      {children}
    </AuthContext.Provider>
  )
}
