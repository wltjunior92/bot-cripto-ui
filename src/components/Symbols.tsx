import { ChangeEvent, useEffect, useState } from 'react'

import { debounce } from 'lodash'

import { Button } from './Button'
import { CheckboxInput } from './CheckboxInput'
import { Pagination } from './Pagination'
import { SearchField } from './SearchField'
import { SymbolDTO } from '../dtos/userDTO'
import { useAuth } from '../hooks/useAuth'
import { useEnums } from '../hooks/useEnums'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  searchSymbols,
  syncSymbols,
  updateFavoriteSymbol,
} from '../services/SymbolsService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'
import { requestNotificationHandler } from '../utils/requestNotificationHandler'

export function Symbols() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isOnlyFavorites, setIsOnlyFavorites] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [symbols, setSymbols] = useState<SymbolDTO[]>([])

  const [page, setPage] = useState(1)
  const [symbolsPerPage, setSymbolsPerPage] = useState(0)
  const [total, setTotal] = useState(0)

  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)

  const { setIsLoggedInAction } = useAuth()
  const { setSymbolsAction } = useEnums()

  function handleTypeSearch(value: string) {
    debouncedSearch(value)
  }

  const debouncedSearch = debounce((search) => {
    setSearchTerm(search)
  }, 650)

  async function fetchSymbols() {
    const result = await searchSymbols(searchTerm, isOnlyFavorites, page, token)

    if (!result.success) {
      return requestNotificationHandler(result, setIsLoggedInAction)
    }

    setSymbols(result.data.symbols)
    setSymbolsPerPage(result.data.page_qty)
    setTotal(result.data.count)
  }

  async function handleSyncSymbols() {
    setIsSyncing(true)

    try {
      const result = await syncSymbols(token)

      if (!result.success) {
        return requestNotificationHandler(result, setIsLoggedInAction)
      }

      requestNotificationHandler(result)
    } finally {
      setIsSyncing(false)
    }
  }

  async function handleFavoriteSymbol(symbol: string, value: boolean) {
    const result = await updateFavoriteSymbol(token, symbol, value)

    if (!result.success) {
      return requestNotificationHandler(result, setIsLoggedInAction)
    }

    const symbolIndex = symbols.findIndex((s) => s.symbol === symbol)
    const cloneList = [...symbols]
    cloneList[symbolIndex] = result.data

    setSymbols(cloneList)
    setSymbolsAction(cloneList)
    requestNotificationHandler(result)
  }

  function handleFilterFavorites(e: ChangeEvent) {
    e.preventDefault()
    const eventTarget = e.target as any
    const isOnlyFavoritesSelected = eventTarget.checked

    setIsOnlyFavorites(isOnlyFavoritesSelected)
  }

  useEffect(() => {
    if (!isSyncing) {
      fetchSymbols()
      setPage(1)
    }
  }, [isSyncing])

  useEffect(() => {
    fetchSymbols()
  }, [searchTerm, isOnlyFavorites, page])

  return (
    <div className="col-span-1 md:col-span-12 mt-4 w-full py-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h1 className="col-span-1 md:col-span-12 text-xl mx-6 mb-6 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Pares
      </h1>
      <div className="bg-white dark:bg-gray-800 relative shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className=" w-full md:w-1/2">
            <SearchField onChange={(value) => handleTypeSearch(value)} />
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <CheckboxInput
              id="onlyFavorites"
              label="Apenas favoritos"
              onChange={handleFilterFavorites}
              checked={isOnlyFavorites}
            />
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <Button
              onClick={handleSyncSymbols}
              type="button"
              disabled={isSyncing}
            >
              {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                PAR
              </th>
              <th scope="col" className="px-4 py-3">
                BASE PRECISION
              </th>
              <th scope="col" className="px-4 py-3">
                QUOTE PRECISION
              </th>
              <th scope="col" className="px-4 py-3">
                MIN NOTIONAL
              </th>
              <th scope="col" className="px-4 py-3">
                LOTE MÍNIMO
              </th>
              {/* <th scope="col" className="px-4 py-3">
                <span className="sr-only">AÇÕES</span>
              </th> */}
            </tr>
          </thead>
          <tbody>
            {symbols.length > 0 &&
              symbols.map((symbol) => (
                <tr
                  key={symbol.symbol}
                  className="border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="flex flex-row items-center ">
                      {symbol.symbol}
                      <div
                        title="Favoritar par"
                        className="ml-2 cursor-pointer"
                      >
                        <svg
                          fill={symbol.is_favorite ? '#f7d309' : 'none'}
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="w-5 h-5"
                          onClick={() =>
                            handleFavoriteSymbol(
                              symbol.symbol,
                              !symbol.is_favorite,
                            )
                          }
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <td className="px-4 py-3">{symbol.base_precision}</td>
                  <td className="px-4 py-3">{symbol.quote_precision}</td>
                  <td className="px-4 py-3">{symbol.min_notional}</td>
                  <td className="px-4 py-3">{symbol.min_lot_size}</td>
                  {/* <td className="px-4 py-3">

                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        itensByPage={symbolsPerPage}
        total={total}
        onNavigate={(value) => setPage(value)}
      />
    </div>
  )
}
