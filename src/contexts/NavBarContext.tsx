import { createContext, ReactNode, useState } from 'react'

type NavBarContextDataProps = {
  isOpen: boolean
  handleSetIsOpen: (value: boolean) => void
}

type NavBarContextProviderProps = {
  children: ReactNode
}

export const NavBarContext = createContext<NavBarContextDataProps>(
  {} as NavBarContextDataProps,
)

export function NavBarProvider({ children }: NavBarContextProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleSetIsOpen(value: boolean) {
    setIsOpen(value)
  }

  return (
    <NavBarContext.Provider value={{ isOpen, handleSetIsOpen }}>
      {children}
    </NavBarContext.Provider>
  )
}
