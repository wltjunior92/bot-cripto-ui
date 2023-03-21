import { FormEvent, useEffect, useState } from 'react'
import { SymbolDTO } from '../dtos/userDTO'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getSymbols, syncSymbols } from '../services/SymbolsService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'
import { requestNotificationHandler } from '../utils/requestNotificationHandler'
import { Button } from './Button'

export function Symbols() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [symbols, setSymbols] = useState<SymbolDTO[]>([])
  const [filteredSymbols, setFilteredSymbols] = useState<SymbolDTO[]>([])
  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)

  async function fetchSymbols() {
    const result = await getSymbols(token)

    if (!result.success) {
      return requestNotificationHandler(result)
    }

    setSymbols(result.data)
  }

  async function handleSyncSymbols() {
    setIsSyncing(true)

    try {
      const result = await syncSymbols(token)

      if (!result.success) {
        return requestNotificationHandler(result)
      }

      requestNotificationHandler(result)
    } finally {
      setIsSyncing(false)
    }
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const eventTarget = e.target as any

    setSearchTerm(eventTarget.simple_search.value)
  }

  useEffect(() => {
    if (!isSyncing) {
      fetchSymbols()
    }
  }, [isSyncing])

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredSymbols(symbols)
    } else {
      const filteredList = symbols.filter((s) =>
        s.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredSymbols(filteredList)
    }
  }, [searchTerm, symbols])

  return (
    <div className="col-span-1 md:col-span-12 mt-4 w-full py-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h1 className="col-span-1 md:col-span-12 text-xl mx-6 mb-6 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Pares
      </h1>
      <div className="bg-white dark:bg-gray-800 relative shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className=" w-full md:w-1/2">
            <form className="flex items-center" onSubmit={handleSearch}>
              <label htmlFor="simple-search" className="sr-only">
                Buscar
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple_search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Buscar"
                  required
                />
              </div>
            </form>
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
            {filteredSymbols.length > 0 &&
              filteredSymbols.map((symbol) => (
                <tr
                  key={symbol.symbol}
                  className="border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {symbol.symbol}
                    {symbol.is_favorite && '⭐'}
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
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Exibindo{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            1-10{' '}
          </span>
          de{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            1000
          </span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <a
              href="#"
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Anterior</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-current="page"
              className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              ...
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              100
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Próxima</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
