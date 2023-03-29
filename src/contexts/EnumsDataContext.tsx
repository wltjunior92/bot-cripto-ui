import { createContext, ReactNode, useEffect, useState } from 'react'

import { SymbolDTO } from '../dtos/userDTO'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ReactSelectProps } from '../interfaces/ReactSelectProps'
import { getQuotes, getSymbols } from '../services/SymbolsService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'

type EnumsDataContextDataProps = {
  quotes: ReactSelectProps[]
  symbols: SymbolDTO[]
  isLoading: boolean
  setSymbolsAction: (symbols: SymbolDTO[]) => void
}

type EnumsDataContextProviderProps = {
  children: ReactNode
}

export const EnumsDataContext = createContext<EnumsDataContextDataProps>(
  {} as EnumsDataContextDataProps,
)

export function EnumsDataProvider({ children }: EnumsDataContextProviderProps) {
  const { isLoggedIn } = useAuth()
  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const [isLoading, setIsLoading] = useState(true)
  const [quotes, setQuotes] = useState<ReactSelectProps[]>([])
  const [symbols, setSymbols] = useState<SymbolDTO[]>([])

  function setSymbolsAction(symbols: SymbolDTO[]) {
    setSymbols(symbols)
  }

  const fetchSymbols = async () => {
    const result = await getSymbols(token)

    if (result.success) {
      setSymbols(result.data)
    }
  }

  const fetchQuotes = async () => {
    const result = await getQuotes(token)

    if (result.success) {
      setQuotes(result.data)
    }
  }

  useEffect(() => {
    const path = window.location.pathname
    if (path !== '/') {
      setIsLoading(true)
      try {
        fetchQuotes()
        fetchSymbols()
      } finally {
        setIsLoading(false)
      }
    }
  }, [isLoggedIn, window.location.pathname])

  return (
    <EnumsDataContext.Provider
      value={{ quotes, symbols, isLoading, setSymbolsAction }}
    >
      {children}
    </EnumsDataContext.Provider>
  )
}
