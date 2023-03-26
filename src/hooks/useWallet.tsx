import { useCallback, useEffect, useState } from 'react'

import useWebSocket from 'react-use-websocket'

import { useAuth } from './useAuth'
import { useLocalStorage } from './useLocalStorage'
import { UserBalanceDTO } from '../dtos/userBalaceDTO'
import { env } from '../env'
import { JsonMessageProps } from '../interfaces/JsonMessageProps'
import { getBalance } from '../services/ExchangeService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'
import { requestNotificationHandler } from '../utils/requestNotificationHandler'

type WalletProp = {
  symbol: string
  available: string
  onOrder: string
}

export function useWallet() {
  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const [balance, setBalance] = useState<any>({})
  const [wallet, setWallet] = useState<WalletProp[]>([])

  const { lastJsonMessage } = useWebSocket(env.VITE_APP_WS, {
    onOpen: () => console.log('Connected to App WS Server'),
    onMessage: () => {
      const jsonMessage = lastJsonMessage as JsonMessageProps | null
      if (jsonMessage) {
        if (jsonMessage.balance) {
          setBalance(jsonMessage.balance)
        }
      }
    },
    queryParams: { token },
    onError: (err) => console.error(err),
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000,
  })

  const { setIsLoggedInAction } = useAuth()

  const fetchBalance = useCallback(async () => {
    const result = await getBalance(token)

    if (!result.success) {
      requestNotificationHandler(result, setIsLoggedInAction)
    }

    const parsedBalance = result.data ? parseBallanceData(result.data) : []
    setWallet(parsedBalance)
  }, [balance])

  function parseBallanceData(balance: UserBalanceDTO) {
    const parsedBalance = Object.entries(balance).map((item) => ({
      symbol: item[0],
      available: item[1].available,
      onOrder: item[1].onOrder,
    }))
    return parsedBalance as WalletProp[]
  }

  useEffect(() => {
    fetchBalance()
  }, [balance])

  return { wallet }
}
