import { useState } from 'react'

import useWebSocket from 'react-use-websocket'

import { BookTicker } from '../components/BookTicker'
import { CandleChart } from '../components/CandleChart'
import { MiniTicker } from '../components/MiniTicker'
import { NewOrderButton } from '../components/NewOrderButton'
import { Wallet } from '../components/Wallet'
import { env } from '../env'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { JsonMessageProps } from '../interfaces/JsonMessageProps'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'

export default function Dashboard() {
  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const [miniTicker, setMiniTicker] = useState<any>({})
  const [bookTicker, setBookTicker] = useState<any>({})
  const [balance, setBalance] = useState<any>({})
  const { lastJsonMessage } = useWebSocket(env.VITE_APP_WS, {
    onOpen: () => console.log('Connected to App WS Server'),
    onMessage: () => {
      const jsonMessage = lastJsonMessage as JsonMessageProps | null
      if (jsonMessage) {
        if (jsonMessage.miniTicker) {
          setMiniTicker(jsonMessage.miniTicker)
        }
        if (jsonMessage.book) {
          jsonMessage.book.forEach((b: { symbol: string }) => {
            bookTicker[b.symbol] = b
          })
          setBookTicker(bookTicker)
        }
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

  return (
    <main className="p-4 sm:ml-64 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 mt-14">
        <div className="grid grid-cols-6 md:grid-cols-12 col-span-1 md:col-span-12 mt-4">
          <h1 className="col-span-3 md:col-span-10 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Dashboard
          </h1>
          <div className="col-span-3 md:col-span-2">
            <NewOrderButton />
          </div>
        </div>
        <div className="candle-chart">
          <CandleChart />
        </div>
        <MiniTicker data={miniTicker} />
        <BookTicker data={bookTicker} />
        <Wallet data={balance} />
      </div>
    </main>
  )
}
