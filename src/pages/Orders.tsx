import { useEffect, useState } from 'react'

import { debounce } from 'lodash'

import { Breadcumb } from '../components/Breadcumb'
import { NewOrderButton } from '../components/NewOrderButton'
import { OrderRow } from '../components/OrderRow'
import { Pagination } from '../components/Pagination'
import { SearchField } from '../components/SearchField'
import { TableSkeleton } from '../components/TableSkeleton'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { cancelOrder, getOrders, syncOrder } from '../services/OrdersService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'
import { confirmAction } from '../utils/modals'
import { requestNotificationHandler } from '../utils/requestNotificationHandler'

const breadcumbNav = [
  {
    label: 'Home',
    link: '/dashboard',
  },
  {
    label: 'Ordens',
  },
]

export default function Orders() {
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [isSynching, setIsSynching] = useState(false)

  const [page, setPage] = useState(1)
  const [ordersPerPage, setOrdersPerPage] = useState(0)
  const [total, setTotal] = useState(0)

  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)

  function handleTypeSearch(value: string) {
    debouncedSearch(value)
  }

  const debouncedSearch = debounce((search) => {
    setSearch(search)
  }, 650)

  async function onCancelOrder(symbol: string, orderId: string) {
    const isConfirmed = await confirmAction(
      'Tem certeza que deseja cancelar a ordem?',
    )
    if (isConfirmed) {
      const result = await cancelOrder(symbol, orderId, token)

      if (!result.success) {
        requestNotificationHandler(result)
      }

      const orderIndex = orders.findIndex((o) => o.id === result.data.id)
      const copyList = [...orders]
      copyList[orderIndex] = result.data
      setOrders(copyList)
    }
  }

  async function onSyncOrder(id: string) {
    setIsSynching(true)
    const result = await syncOrder(id, true, token)

    if (!result.success) {
      setIsSynching(false)
      return requestNotificationHandler(result)
    }

    const orderIndex = orders.findIndex((o) => o.id === result.data.id)
    const copyList = [...orders]
    copyList[orderIndex] = result.data
    setOrders(copyList)
    requestNotificationHandler(result)
    setIsSynching(false)
  }

  async function fetchOrders() {
    setIsLoading(true)
    try {
      const result = await getOrders(search, token, page)

      if (!result.success) {
        return requestNotificationHandler(result)
      }

      Promise.all([
        setOrders(result.data.orders),
        setTotal(result.data.count),
        setOrdersPerPage(result.data.page_qty),
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [search, page])

  return (
    <main className="p-4 sm:ml-64 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 mt-14">
        <div className="grid grid-cols-6 md:grid-cols-12 col-span-1 md:col-span-12 mt-4">
          <h1 className="col-span-3 md:col-span-10 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Ordens
          </h1>
          <div className="col-span-3 md:col-span-2">
            <NewOrderButton />
          </div>
        </div>
        <div className="grid grid-cols-6 md:grid-cols-12 col-span-1 md:col-span-12 mt-4">
          <Breadcumb itens={breadcumbNav} />
        </div>
        <div className="col-span-1 md:col-span-12 mt-4 w-full py-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 px-4 pb-4">
            <div className=" w-full md:w-1/2">
              <SearchField onChange={(value) => handleTypeSearch(value)} />
            </div>
          </div>
          <div className="overflow-x-auto mt-4 md:mt-0">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 sticky left-0 bg-gray-200 dark:bg-gray-700"
                  >
                    PAR
                  </th>
                  <th scope="col" className="px-4 py-3">
                    DATA
                  </th>
                  <th scope="col" className="px-4 py-3">
                    LADO
                  </th>
                  <th scope="col" className="px-4 py-3">
                    QTD
                  </th>
                  <th scope="col" className="px-4 py-3">
                    LÍQUIDO
                  </th>
                  <th scope="col" className="px-4 py-3">
                    SITUAÇÃO
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">AÇÕES</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  orders.length > 0 &&
                  orders.map((item: any) => (
                    <OrderRow
                      key={item.id}
                      data={item}
                      onCancel={onCancelOrder}
                      onSync={onSyncOrder}
                      isSynching={isSynching}
                    />
                  ))}
              </tbody>
            </table>
            {isLoading && <TableSkeleton />}
          </div>
          <Pagination
            page={page}
            itensByPage={ordersPerPage}
            total={total}
            onNavigate={(value) => setPage(value)}
          />
        </div>
      </div>
    </main>
  )
}
