import { useCallback, useEffect, useState } from 'react'

import { UserBalanceDTO } from '../dtos/userBalaceDTO'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getBalance } from '../services/ExchangeService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'
import { requestNotificationHandler } from '../utils/requestNotificationHandler'

type Balance = {
  symbol: string
  available: string
  onOrder: string
}

type WalletProps = {
  data: any
}

export function Wallet({ data }: WalletProps) {
  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const [balance, setBalance] = useState<Balance[]>([])

  const { setIsLoggedInAction } = useAuth()

  const fetchBalance = useCallback(async () => {
    const result = await getBalance(token)

    if (!result.success) {
      requestNotificationHandler(result, setIsLoggedInAction)
    }

    const parsedBalance = result.data ? parseBallanceData(result.data) : []
    setBalance(parsedBalance)
  }, [data])

  function parseBallanceData(balance: UserBalanceDTO) {
    const parsedBalance = Object.entries(balance).map((item) => ({
      symbol: item[0],
      available: item[1].available,
      onOrder: item[1].onOrder,
    }))
    return parsedBalance
  }

  useEffect(() => {
    if (data && Object.entries(data).length) {
      setBalance(data)
    } else {
      fetchBalance()
    }
  }, [data])

  return (
    <div className="col-span-1 md:col-span-6 mt-4 w-full py-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-12 px-4">
        <h1 className="col-span-1 md:col-span-12 text-xl mb-6 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Carteira
        </h1>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-80 mt-4 md:mt-0">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3">
                MOEDA
              </th>
              <th scope="col" className="px-4 py-3">
                LIBERADO
              </th>
              <th scope="col" className="px-4 py-3">
                BLOQUEADO
              </th>
            </tr>
          </thead>
          <tbody>
            {balance.map((item) => (
              <tr key={item.symbol} className="border-b dark:border-gray-700">
                <td
                  scope="row"
                  className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.symbol}
                </td>
                <td className="px-4 py-3">
                  {`${item.available}`.substring(0, 8)}
                </td>
                <td className="px-4 py-3">
                  {`${item.onOrder}`.substring(0, 8)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
