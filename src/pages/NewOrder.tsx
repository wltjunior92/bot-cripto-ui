import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { RiAlertFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
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
import { postOrderService } from '../services/OrdersService'
import { getSymbol } from '../services/SymbolsService'
import { JWT_TOKEN_KEY_NAME, STOP_TYPES } from '../utils/constants'
import { requestNotificationHandler } from '../utils/requestNotificationHandler'
import { newOrderFormValidationSchema } from '../utils/schemaValidations'

export type NewOrderFormData = zod.infer<typeof newOrderFormValidationSchema>

const DEFAULT_VALUES: NewOrderFormData = {
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

export default function NewOrder() {
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolDTO>()
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY')
  const [orderTotal, setOrderTotal] = useState('0')
  const [exchangeError, setExchangeError] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [order, setOrder] = useState<NewOrderFormData>(DEFAULT_VALUES)

  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const { setIsLoggedInAction } = useAuth()
  const { wallet } = useWallet()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<NewOrderFormData>({
    resolver: zodResolver(newOrderFormValidationSchema),
    defaultValues: {
      symbol: order.symbol,
      order_type: order.order_type,
      limit_price: order.limit_price,
      quantity: order.quantity,
      options: {
        iceberg_quantity: order.options.iceberg_quantity,
        stop_price: order.options.stop_price,
      },
    },
  })

  const symbol = watch('symbol')
  const orderType = watch('order_type')
  const orderPrice = watch('limit_price')
  const orderQuantity = watch('quantity')
  const orderIcebergQty = watch('options.iceberg_quantity')

  async function handleSubmitForm(data: NewOrderFormData) {
    const result = await postOrderService(data, orderSide, token)

    if (!result.success) {
      return requestNotificationHandler(result, setIsLoggedInAction)
    }

    requestNotificationHandler(result)
    navigate('/dashboard')
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

  async function fetchSymbol() {
    const result = await getSymbol(token, symbol || '')

    if (!result.success) {
      return requestNotificationHandler(result, setIsLoggedInAction)
    }

    setSelectedSymbol(result.data)
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

  return (
    <main className="p-4 sm:ml-64 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 mt-14">
        <div className="col-span-1 md:col-span-12 mt-4">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Nova Ordem
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
          <div className="col-span-12 md:col-span-6">
            <Controller
              name="symbol"
              control={control}
              render={({ field: { onChange, ref, value } }) => (
                <SelectSymbol
                  ref={ref}
                  id="symbol"
                  error={errors.symbol as any}
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
          <div className="col-span-12 md:col-span-6">
            <SymbolPrice symbol={symbol} onPriceChange={onPriceChange} />
          </div>
          <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-x-2">
            <WalletSummary symbol={selectedSymbol} showLabel wallet={wallet} />
          </div>
          <div className="col-span-12 md:col-span-6 grid grid-cols-2">
            <SelectSide
              orderSide={orderSide}
              onAction={(value) => setOrderSide(value)}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Select
              id="type"
              label="Tipo de ordem:"
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
              error={errors.limit_price as any}
              placeholder={orderType === 'MARKET' ? 'Operação a mercado' : '0'}
              disabled={orderType === 'MARKET'}
              {...register('limit_price')}
            />
          </div>
          {orderType && STOP_TYPES.includes(orderType) && (
            <div className="col-span-12 md:col-span-6">
              <Input
                id="options.stop_price"
                label="Preço stop:"
                placeholder="0"
                error={errors.options && (errors.options.stop_price as any)}
                type="number"
                {...register('options.stop_price')}
              />
            </div>
          )}
          <div className="col-span-12 md:col-span-6">
            <QuantityInput
              id="quantity"
              label="Quantidade:"
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
              value={orderType === 'MARKET' ? `${orderTotal} ~` : orderTotal}
              disabled
            />
          </div>
          <div className="col-span-12 mt-6">
            <div className="flex flex-col md:flex-row">
              {exchangeError && (
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
                <Button type="submit" disabled={!!exchangeError}>
                  Enviar ordem
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
