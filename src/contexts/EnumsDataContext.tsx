import { createContext, ReactNode, useEffect, useState } from 'react'

import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ReactSelectProps } from '../interfaces/ReactSelectProps'
import { getQuotes, getSymbols } from '../services/SymbolsService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'

type SymbolsProps = {
  isFavorite: boolean
  symbol: ReactSelectProps
}

type EnumsDataContextDataProps = {
  quotes: ReactSelectProps[]
  symbols: SymbolsProps[]
  isLoading: boolean
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
  const [symbols, setSymbols] = useState<SymbolsProps[]>([])

  const fetchSymbols = async () => {
    const result = await getSymbols(token)

    if (result.success) {
      const symbolsNames = result.data.map(
        (s: { symbol: string; is_favorite: boolean }) => ({
          isFavorite: s.is_favorite,
          symbol: { value: s.symbol, label: s.symbol },
        }),
      )
      setSymbols(symbolsNames)
    }
  }

  const fetchQuotes = async () => {
    const result = await getQuotes(token)

    if (result.success) {
      setQuotes(result.data)
    }
  }

  useEffect(() => {
    console.log(window.location.pathname)
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
    <EnumsDataContext.Provider value={{ quotes, symbols, isLoading }}>
      {children}
    </EnumsDataContext.Provider>
  )
}
