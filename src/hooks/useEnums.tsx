import { useContext } from 'react'

import { EnumsDataContext } from '../contexts/EnumsDataContext'

export function useEnums() {
  const context = useContext(EnumsDataContext)

  return context
}
