import { useState } from 'react'

import useWebSocket from 'react-use-websocket'

import { env } from '../env'
import { JsonMessageProps } from '../interfaces/JsonMessageProps'

type SymbolPriceProps = {
  symbol?: string
}

export function SymbolPrice({ symbol }: SymbolPriceProps) {
  const [book, setBook] = useState({ bid: '0', ask: '0' })

  function getBinanceWSUrl() {
    return `${env.VITE_APP_BWS_URL}/${
      symbol ? symbol.toLowerCase() : ''
    }@bookTicker`
  }

  const { lastJsonMessage, sendJsonMessage } = useWebSocket(getBinanceWSUrl(), {
    onOpen: () => {
      if (!symbol) return
      console.log(`Connected to Binance Stream ${symbol}`)
      sendJsonMessage({
        method: 'SUBSCRIBE',
        params: [`${symbol.toLowerCase()}@bookTicker`],
        id: 1,
      })
    },
    onMessage: () => {
      if (!symbol) return
      const jsonMessage = lastJsonMessage as JsonMessageProps | null
      if (jsonMessage) {
        setBook({ bid: jsonMessage.b, ask: jsonMessage.a })
      }
    },
    onError: (event) => {
      if (!symbol) return
      console.error(event)
    },
    shouldReconnect: (closeEvent) => {
      if (!symbol) return false
      return true
    },
    reconnectInterval: 3000,
  })

  return (
    <div className="ml-auto w-full md:w-fit">
      <div className="flex mr-4 mb-1">
        <span className="text-gray-900 dark:text-white text-xs">
          Spread {symbol || '-------'}:
        </span>
      </div>
      <div className="border w-full md:w-[150px] rounded-lg dark:border-gray-600 border-white dark:bg-gray-900 bg-gray-700 shadow-inner dark:shadow-black shadow-gray-800 overflow-hidden">
        <div className="flex flex-row border-b dark:border-gray-600 border-gray-400">
          <div className="bg-red-800 px-2 w-11">
            <span className="text-white font-mono">BID</span>
          </div>
          <div className="px-2">
            <span className="text-gray-100 font-mono">
              {`${book.bid || '0'}`.substring(0, 9)}
            </span>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="bg-green-800 px-2 w-11">
            <span className="text-white font-mono">ASK</span>
          </div>
          <div className="px-2">
            <span className="text-gray-100 font-mono">
              {`${book.ask || '0'}`.substring(0, 9)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
