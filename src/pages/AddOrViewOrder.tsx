import { useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { GoSync } from 'react-icons/go'
import { RiAlertFill } from 'react-icons/ri'
import { useNavigate, useParams } from 'react-router-dom'
import * as zod from 'zod'

import { Breadcumb } from '../components/Breadcumb'
import { Button } from '../components/Button'
import { FeedbackAlert } from '../components/FeedbackAlert'
import { Input } from '../components/Input'
import { QuantityInput } from '../components/QuantityInput'
import { Select } from '../components/Select'
import { SelectSide } from '../components/SelectSide'
import { SelectSymbol } from '../components/SelectSymbol'
import { Book, SymbolPrice } from '../components/SymbolPrice'
import { WalletSummary } from '../components/WalletSummary'
import { SymbolDTO } from '../dtos/userDTO'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useWallet } from '../hooks/useWallet'
import { ReactSelectProps } from '../interfaces/ReactSelectProps'
import {
  cancelOrder,
  getOrder,
  postOrderService,
  syncOrder,
} from '../services/OrdersService'
import { getSymbol } from '../services/SymbolsService'
import { JWT_TOKEN_KEY_NAME, STOP_TYPES } from '../utils/constants'
import { getDateFromTimestamp } from '../utils/dataConvertions'
import { confirmAction } from '../utils/modals'
import { requestNotificationHandler } from '../utils/requestNotificationHandler'
import { addOrViewOrderFormValidationSchema } from '../utils/schemaValidations'

export type AddOrViewOrderFormData = zod.infer<
  typeof addOrViewOrderFormValidationSchema
>

type FormType = AddOrViewOrderFormData & {
  order_id?: string
  client_order_id?: string
  order_status?: string
  net?: string
  avg_price?: string
  transact_time?: number
  is_maker?: boolean
  commission?: string
  obs?: string
  automation_id?: string
  id?: string
}

const DEFAULT_VALUES: FormType = {
  symbol: null,
  order_type: 'NONE',
  order_side: 'BUY',
  quantity: '',
  limit_price: '',
  options: {
    stop_price: '',
    iceberg_quantity: '',
  },
}

const breadcumbNav = [
  {
    label: 'Home',
    link: '/dashboard',
  },
  {
    label: 'Ordens',
    link: '/orders',
  },
  {
    label: 'Nova',
  },
]

export default function AddOrViewOrder() {
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolDTO>()
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY')
  const [orderTotal, setOrderTotal] = useState('0')
  const [exchangeError, setExchangeError] = useState('')
  const [isSynching, setIsSynching] = useState(false)

  // eslint-disable-next-line no-unused-vars
  const [order, setOrder] = useState<FormType>(DEFAULT_VALUES)

  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const { setIsLoggedInAction } = useAuth()
  const { wallet } = useWallet()

  const navigate = useNavigate()

  const { id: orderId } = useParams()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AddOrViewOrderFormData>({
    resolver: zodResolver(addOrViewOrderFormValidationSchema),
    defaultValues: useMemo(() => {
      return {
        symbol: order.symbol,
        order_type: order.order_type,
        limit_price: order.limit_price,
        quantity: order.quantity,
        options: {
          iceberg_quantity: order.options.iceberg_quantity,
          stop_price: order.options.stop_price,
        },
      }
    }, [order]),
  })

  const symbol = watch('symbol')
  const orderType = watch('order_type')
  const orderPrice = watch('limit_price')
  const orderQuantity = watch('quantity')
  const orderIcebergQty = watch('options.iceberg_quantity')

  async function handleSubmitForm(data: AddOrViewOrderFormData) {
    const result = await postOrderService(data, orderSide, token)

    if (!result.success) {
      return requestNotificationHandler(result, setIsLoggedInAction)
    }

    requestNotificationHandler(result)
    navigate('/orders')
  }

  function onPriceChange(book: Book) {
    const quantity = parseFloat(orderQuantity)
    if (orderType === 'MARKET' && quantity) {
      setExchangeError('')
      if (orderSide === 'BUY') {
        setOrderTotal(`${quantity * parseFloat(book.ask)}`.substring(0, 8))
      } else {
        setOrderTotal(`${quantity * parseFloat(book.bid)}`.substring(0, 8))
      }

      if (
        parseFloat(orderTotal) < parseFloat(`${selectedSymbol?.min_notional}`)
      ) {
        setExchangeError(
          `O valor total da ordem deve ser maior ou igual a ${selectedSymbol?.min_notional}`,
        )
      }
    }
  }

  async function onCancelOrder(symbol: string, orderId: string) {
    const isConfirmed = await confirmAction(
      'Tem certeza que deseja cancelar a ordem?',
    )
    if (isConfirmed) {
      const result = await cancelOrder(symbol, orderId, token)

      if (!result.success) {
        return requestNotificationHandler(result)
      }

      requestNotificationHandler(result)
      navigate('/orders')
    }
  }

  async function onSyncOrder(id: string) {
    setIsSynching(true)
    const result = await syncOrder(id, false, token)

    if (!result.success) {
      requestNotificationHandler(result)
    }

    setOrder(result.data)
    requestNotificationHandler(result)
    setIsSynching(false)
  }

  async function fetchSymbol() {
    const result = await getSymbol(token, symbol || '')

    if (!result.success) {
      return requestNotificationHandler(result, setIsLoggedInAction)
    }

    setSelectedSymbol(result.data)
  }

  function getStatusClasses(status: string) {
    switch (status) {
      case 'PARTIALLY_FILLED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'FILLED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'REJECTED':
      case 'EXPIRED':
      case 'CANCELED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-300 dark:text-gray-900'
    }
  }

  useEffect(() => {
    if (!symbol) return
    fetchSymbol()
  }, [symbol])

  useEffect(() => {
    setExchangeError('')

    const quantity = parseFloat(`${orderQuantity}`)

    if (quantity && quantity < parseFloat(`${selectedSymbol?.min_lot_size}`)) {
      return setExchangeError(
        `Quantidade mínima negociável deve ser maior ou igual a ${selectedSymbol?.min_lot_size}`,
      )
    }

    if (orderType === 'ICEBERG') {
      const icebergQty = parseFloat(`${orderIcebergQty}`)

      if (
        icebergQty &&
        icebergQty < parseFloat(`${selectedSymbol?.min_lot_size}`)
      ) {
        return setExchangeError(
          `Quantidade mínima negociável para ordem Iceberg deve ser maior ou igual a ${selectedSymbol?.min_lot_size}`,
        )
      }
    }

    if (!quantity) return

    const price = parseFloat(`${orderPrice}`)
    if (!price) return

    const total = price * quantity
    setOrderTotal(`${total}`)

    const minNotional = parseFloat(`${selectedSymbol?.min_notional}`)

    if (total < minNotional) {
      setExchangeError(
        `O valor total da ordem deve ser maior ou igual a ${selectedSymbol?.min_notional}`,
      )
    }
  }, [orderQuantity, orderPrice, orderIcebergQty])

  useEffect(() => {
    if (orderType === 'MARKET') {
      setError('limit_price', {})
      setValue('limit_price', '')
    }
    if (orderType !== 'ICEBERG') {
      setError('options.iceberg_quantity', {})
      setValue('options.iceberg_quantity', '')
    }
  }, [orderType])

  useEffect(() => {
    if (orderId) {
      breadcumbNav[breadcumbNav.length - 1] = {
        label: 'Detelhes',
      }
      getOrder(orderId, token)
        .then((result) => {
          if (!result.success) {
            requestNotificationHandler(result)
          }

          setOrder(result.data)
          setValue('symbol', result.data.symbol)
          setValue('quantity', result.data.quantity)
          setValue('order_side', result.data.order_side)
          setValue('order_type', result.data.order_type)
          setValue('limit_price', result.data.limit_price)
          setValue(
            'options.iceberg_quantity',
            result.data.options.iceberg_quantity,
          )
          setOrderSide(result.data.order_side)
          setValue('options.stop_price', result.data.options.stop_price)
        })
        .catch((error) => console.log(error))
    } else {
      breadcumbNav[breadcumbNav.length - 1] = {
        label: 'Nova',
      }
    }
  }, [])

  return (
    <main className="p-4 sm:ml-64 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 mt-14">
        <div className="col-span-1 md:col-span-12 mt-4">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            {orderId ? 'Detalhes' : 'Nova Ordem'}
          </h1>
        </div>
        <div className="grid grid-cols-6 md:grid-cols-12 col-span-1 md:col-span-12 mt-4">
          <Breadcumb itens={breadcumbNav} />
        </div>
        <form
          className="col-span-1 md:col-span-12 grid mt-4 gap-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          onSubmit={handleSubmit(handleSubmitForm)}
          autoComplete="off"
        >
          {order.id && (
            <div className="col-span-12">
              <button
                type="button"
                title="Sincronizar ordem"
                onClick={() => onSyncOrder(order.id as string)}
                disabled={isSynching}
                className="w-10 h-10 flex items-center justify-center disabled:cursor-not-allowed bg-gray-300 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md ml-auto"
              >
                <GoSync
                  className={`w-6 h-6 fill-blue-800 dark:fill-blue-200 transition duration-75 ${
                    isSynching ? 'animate-spin' : ''
                  }`}
                />
              </button>
            </div>
          )}
          <div className="col-span-12 md:col-span-6">
            <Controller
              name="symbol"
              control={control}
              render={({ field: { onChange, ref, value } }) => (
                <SelectSymbol
                  ref={ref}
                  id="symbol"
                  error={errors.symbol as any}
                  disabled={!!orderId}
                  onChange={(e) => {
                    const event = e as ReactSelectProps
                    onChange(event.value)
                  }}
                  value={value}
                  label="Par de moedas:"
                />
              )}
              rules={{ required: true }}
            />
          </div>
          {(!orderId || order.order_status === 'NEW') && (
            <div className="col-span-12 md:col-span-6">
              <SymbolPrice symbol={symbol} onPriceChange={onPriceChange} />
            </div>
          )}
          <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-x-2">
            <WalletSummary symbol={selectedSymbol} showLabel wallet={wallet} />
          </div>
          <div className="col-span-12 md:col-span-6 grid grid-cols-2">
            <SelectSide
              orderSide={orderSide}
              onAction={(value) => setOrderSide(value)}
              isDisabled={!!orderId}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Select
              id="type"
              label="Tipo de ordem:"
              disabled={!!orderId}
              error={errors.order_type as any}
              {...register('order_type')}
            >
              <option value="NONE">Selecione um tipo de ordem</option>
              <option value="ICEBERG">Iceberg</option>
              <option value="LIMIT">Limit</option>
              <option value="MARKET">A mercado</option>
              <option value="STOP_LOSS">Stop Loss</option>
              <option value="STOP_LOSS_LIMIT">Stop Loss Limit</option>
              <option value="TAKE_PROFIT">Take Profit</option>
              <option value="TAKE_PROFIT_LIMIT">Take Profit Limit</option>
            </Select>
          </div>
          <div className="col-span-12 md:col-span-6">
            <Input
              id="limit_price"
              label="Preço por unidade:"
              type="number"
              step="any"
              min={0}
              error={errors.limit_price as any}
              placeholder={orderType === 'MARKET' ? 'Operação a mercado' : '0'}
              disabled={orderType === 'MARKET' || !!orderId}
              {...register('limit_price')}
            />
          </div>
          {orderType && STOP_TYPES.includes(orderType) && (
            <div className="col-span-12 md:col-span-6">
              <Input
                id="options.stop_price"
                label="Preço stop:"
                placeholder="0"
                type="number"
                step="any"
                min={0}
                disabled={!!orderId}
                error={errors.options && (errors.options.stop_price as any)}
                {...register('options.stop_price')}
              />
            </div>
          )}
          <div className="col-span-12 md:col-span-6">
            <QuantityInput
              id="quantity"
              label="Quantidade:"
              disabled={!!orderId}
              onCalc={(value) => setValue('quantity', value)}
              side={orderSide}
              wallet={wallet}
              error={errors.quantity as any}
              price={orderPrice}
              symbol={selectedSymbol}
              {...register('quantity')}
            />
          </div>
          {orderType === 'ICEBERG' && (
            <div className="col-span-12 md:col-span-6">
              <QuantityInput
                id="options.iceberg_quantity"
                label="Quantidade Iceberg:"
                disabled={!!orderId}
                onCalc={(value) => setValue('options.iceberg_quantity', value)}
                side={orderSide}
                error={
                  errors.options && (errors.options.iceberg_quantity as any)
                }
                wallet={wallet}
                price={orderPrice}
                symbol={selectedSymbol}
                {...register('options.iceberg_quantity')}
              />
            </div>
          )}
          <div className="col-span-12 md:col-span-6">
            <Input
              id="price"
              label="Total:"
              value={
                !order.order_status || order.order_status === 'NEW'
                  ? orderType === 'MARKET'
                    ? `${orderTotal} ~`
                    : orderTotal
                  : order.net || 0
              }
              disabled
            />
          </div>
          {!!orderId && (
            <>
              <div className="col-span-12">
                <h1 className="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-lg dark:text-white mt-8">
                  Outras informações
                </h1>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label
                  htmlFor="order_status"
                  className="text-gray-900 dark:text-white font-semibold"
                >
                  Situação da ordem:
                </label>
                <div id="order_status" className="grid grid-cols-2 py-2 mt-2">
                  <span
                    className={`w-fit text-md font-medium mr-2 px-2.5 py-0.5 rounded-lg ${getStatusClasses(
                      order.order_status as string,
                    )}`}
                  >
                    {order.order_status}
                  </span>
                  {order.is_maker && (
                    <span
                      title="'IS MAKER' da operação"
                      className="w-fit ml-auto text-md font-medium px-2.5 py-0.5 rounded-lg bg-yellow-300 text-yellow-100 dark:bg-yellow-500"
                    >
                      M
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label
                  htmlFor="order_id"
                  className="text-gray-900 dark:text-white font-semibold"
                >
                  ID da Ordem:
                </label>
                <div
                  id="order_id"
                  className="grid grid-cols-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 p-2 mt-2"
                >
                  <span className="break-words col-span-2 text-gray-700 dark:text-gray-200 font-normal">
                    {order.id}
                  </span>
                </div>
              </div>
              {order.automation_id && (
                <div className="col-span-12 md:col-span-6">
                  <label
                    htmlFor="automation_id"
                    className="text-gray-900 dark:text-white font-semibold"
                  >
                    ID da Automação:
                  </label>
                  <div
                    id="automation_id"
                    className="grid grid-cols-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 p-2 mt-2"
                  >
                    <span className="break-words col-span-2 text-gray-700 dark:text-gray-200 font-normal">
                      {order.automation_id}
                    </span>
                  </div>
                </div>
              )}
              <div className="col-span-12 md:col-span-6">
                <label
                  htmlFor="exchange_ids"
                  className="text-gray-900 dark:text-white font-semibold"
                >
                  IDs da Corretora:
                </label>
                <div
                  id="exchange_ids"
                  className="grid grid-cols-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 p-2 mt-2"
                >
                  <span className="break-words text-gray-700 dark:text-gray-200 font-normal">
                    {order.order_id}
                  </span>
                  <span className="break-words text-gray-700 dark:text-gray-200 font-normal pl-2 border-l border-gray-300 dark:border-gray-600">
                    {order.client_order_id}
                  </span>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <label
                  htmlFor="exchange_ids"
                  className="text-gray-900 dark:text-white font-semibold"
                >
                  Data da operação:
                </label>
                <div
                  id="exchange_ids"
                  className="grid grid-cols-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 p-2 mt-2"
                >
                  <span className="break-words text-gray-700 dark:text-gray-200 font-normal">
                    {getDateFromTimestamp(
                      order.transact_time,
                      'medium',
                      'medium',
                    )}
                  </span>
                </div>
              </div>
              {order.commission && (
                <div className="col-span-12 md:col-span-6">
                  <label
                    htmlFor="commission"
                    className="text-gray-900 dark:text-white font-semibold"
                  >
                    Comissão da exchange:
                  </label>
                  <div
                    id="commission"
                    className="grid grid-cols-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 p-2 mt-2"
                  >
                    <span className="break-words text-gray-700 dark:text-gray-200 font-normal">
                      {order.commission}
                    </span>
                  </div>
                </div>
              )}
              {order.obs && (
                <div className="col-span-12 md:col-span-6">
                  <label
                    htmlFor="obs"
                    className="text-gray-900 dark:text-white font-semibold"
                  >
                    Observações da Exchange:
                  </label>
                  <div
                    id="obs"
                    className="grid grid-cols-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 p-2 mt-2"
                  >
                    <span className="break-words text-gray-700 dark:text-gray-200 font-normal">
                      {order.obs}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          <div className="col-span-12 mt-6">
            <div className="flex flex-col md:flex-row">
              {exchangeError && !orderId && (
                <FeedbackAlert
                  className="max-w-full"
                  message={exchangeError}
                  color="failure"
                  alertIcon={
                    <RiAlertFill className="w-5 h-5 fill-red-500 mr-2" />
                  }
                />
              )}
              <div className="w-full md:w-2/12 ml-auto mt-4 md:mt-0">
                {!orderId ? (
                  <>
                    <Button
                      type="submit"
                      disabled={!!exchangeError || isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex flex-row items-center justify-center">
                          <div role="status">
                            <svg
                              aria-hidden="true"
                              className="inline w-4 h-4 mr-2 text-gray-200 bg-transparent animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span className="sr-only">Loading...</span>
                          </div>
                          Enviando...
                        </div>
                      ) : (
                        <>Enviar Ordem</>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    disabled={order.order_status !== 'NEW'}
                    variant="danger"
                    onClick={() =>
                      onCancelOrder(
                        order.symbol as string,
                        order.order_id as string,
                      )
                    }
                  >
                    {isSubmitting ? (
                      <div className="flex flex-row items-center justify-center">
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="inline w-4 h-4 mr-2 text-gray-200 bg-transparent animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                        Cancelando...
                      </div>
                    ) : (
                      <>Cancelar Ordem</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
