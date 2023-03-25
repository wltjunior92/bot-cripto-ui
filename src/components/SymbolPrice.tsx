import { useState } from 'react'

import { Label } from 'flowbite-react'
import useWebSocket from 'react-use-websocket'

import { env } from '../env'
import { JsonMessageProps } from '../interfaces/JsonMessageProps'

type SymbolPriceProps = {
  symbol: string
}

export function SymbolPrice({ symbol }: SymbolPriceProps) {
  const [book, setBook] = useState({ bid: '0', ask: '0' })

  function getBinanceWSUrl() {
    return `${env.VITE_APP_BWS_URL}/${symbol.toLowerCase()}@bookTicker`
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
    <div>
      <Label
        htmlFor="book"
        value="Preço"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      />
      <div id="book">
        BID: {book.bid}
        <br />
        ASK: {book.ask}
      </div>
    </div>
  )
}
