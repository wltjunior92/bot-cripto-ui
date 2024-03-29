import { AiFillEye } from 'react-icons/ai'
import { GoSync } from 'react-icons/go'
import { MdCancel } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { getDateFromTimestamp } from '../utils/dataConvertions'

type OrderRowProps = {
  data: any
  onCancel: (symbol: string, orderId: string) => void
  onSync: (id: string) => void
  isSynching?: boolean
}

export function OrderRow({
  data,
  onCancel,
  onSync,
  isSynching,
}: OrderRowProps) {
  const navigate = useNavigate()

  function getStatusColor(status: string) {
    switch (status) {
      case 'NEW':
        return 'bg-gray-300 dark:bg-gray-50'
      case 'PARTIALLY_FILLED':
        return 'bg-blue-500'
      case 'FILLED':
        return 'bg-emerald-500'
      case 'REJECTED':
      case 'EXPIRED':
      case 'CANCELED':
        return 'bg-red-500'
      default:
        return ''
    }
  }

  return (
    <tr className="border-b dark:border-gray-700">
      <td
        scope="row"
        className="px-4 py-3 font-medium bg-white dark:bg-gray-800 text-gray-900 whitespace-nowrap dark:text-white sticky left-0"
      >
        {data.symbol}
      </td>
      <td className="px-4 py-3">
        {getDateFromTimestamp(data.transact_time, 'short', 'short')}
      </td>
      <td className="px-4 py-3">{data.order_side}</td>
      <td className="px-4 py-3">{data.quantity}</td>
      <td className="px-4 py-3">{data.net}</td>
      <td className="px-4 py-3">
        <div className="flex flex-row space-x-2 items-center">
          <div
            className={`rounded-full w-4 h-4 mr-2 ${getStatusColor(
              data.order_status,
            )}`}
          />
          {data.order_status}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-row space-x-2 justify-end">
          {data.order_status === 'NEW' && (
            <button
              type="button"
              title="Cancelar ordem"
              onClick={() => onCancel(data.symbol, data.order_id)}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
            >
              <MdCancel className="w-6 h-6 fill-red-400 transition duration-75" />
            </button>
          )}
          {!['CANCELED', 'EXPIRED', 'REJECTED'].includes(data.order_status) && (
            <button
              type="button"
              title="Sincronizar ordem"
              onClick={() => onSync(data.id)}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
            >
              <GoSync
                className={`w-6 h-6 fill-blue-800 dark:fill-blue-200 transition duration-75 ${
                  isSynching ? 'animate-spin' : ''
                }`}
              />
            </button>
          )}
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
            onClick={() => navigate(`/orders/edit/${data.id}`)}
          >
            <AiFillEye className="w-6 h-6 fill-gray-500 dark:fill-gray-200 transition duration-75" />
          </button>
        </div>
      </td>
    </tr>
  )
}
