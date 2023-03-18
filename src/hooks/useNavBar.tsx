import { useContext } from 'react'
import { NavBarContext } from '../contexts/NavBarContext'

export function useNavBar() {
  const context = useContext(NavBarContext)

  return context
}
