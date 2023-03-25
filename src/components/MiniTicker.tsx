import { useCallback, useEffect, useState } from 'react'

import { MiniTickerRow } from './MiniTickerRow'
import { SelectQuote } from './SelectQuote'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ReactSelectProps } from '../interfaces/ReactSelectProps'
import { getSymbols } from '../services/SymbolsService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'

type MiniTickerProps = {
  data: any
}

export function MiniTicker({ data }: MiniTickerProps) {
  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const [symbols, setSymbols] = useState<string[]>([])
  const [quote, setQuote] = useState<ReactSelectProps>({
    label: 'BTC',
    value: 'BTC',
  })

  const handleChange = (value: any) => {
    setQuote(value)
  }

  const fetchSymbols = useCallback(async () => {
    const result = await getSymbols(token)

    if (result.success) {
      const filteredSymbols = result.data
        .filter((s: { symbol: string; is_favorite: boolean }) => {
          if (quote.value === 'FAVORITOS') {
            return s.is_favorite
          } else {
            return s.symbol.endsWith(quote.value)
          }
        })
        .map((s: { symbol: string }) => s.symbol) as string[]
      setSymbols(filteredSymbols)
    }
  }, [quote])

  useEffect(() => {
    fetchSymbols()
  }, [quote])

  return (
    <div className="col-span-1 md:col-span-12 mt-4 w-full py-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-12 px-4">
        <h1 className="col-span-1 md:col-span-9 text-xl mb-6 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Mercado 24h
        </h1>
        <div className="col-span-1 md:col-span-3">
          <SelectQuote id="tickerQuote" onChange={handleChange} value={quote} />
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-80 mt-4 md:mt-0">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3">
                PAR
              </th>
              <th scope="col" className="px-4 py-3">
                FECHAMENTO
              </th>
              <th scope="col" className="px-4 py-3">
                ABERTURA
              </th>
              <th scope="col" className="px-4 py-3">
                MÁXIMA
              </th>
              <th scope="col" className="px-4 py-3">
                MÍNIMA
              </th>
            </tr>
          </thead>
          <tbody>
            {!!data &&
              symbols.map((item) => (
                <MiniTickerRow key={item} symbol={item} data={data[item]} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
