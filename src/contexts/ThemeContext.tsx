import { createContext, ReactNode, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type ThemeContextDataProps = {}

type ThemeContextProviderProps = {
  children: ReactNode
}

export const ThemeContext = createContext<ThemeContextDataProps>(
  {} as ThemeContextDataProps,
)

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [theme, setTheme] = useLocalStorage('color-theme', 'dark')

  useEffect(() => {
    if (theme === 'light') {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark')
        setTheme('light')
      }
    } else if (theme === 'dark') {
      if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark')
        setTheme('dark')
      }
    }
  })

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>
}
