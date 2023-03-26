import { useCallback, useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import { RiAlertFill } from 'react-icons/ri'

import { Button } from '../components/Button'
import { FeedbackAlert } from '../components/FeedbackAlert'
import { SelectSymbol } from '../components/SelectSymbol'
import { SymbolPrice } from '../components/SymbolPrice'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useWallet } from '../hooks/useWallet'
import { getSymbol } from '../services/SymbolsService'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'
import { requestNotificationHandler } from '../utils/requestNotificationHandler'

export default function NewOrder() {
  const [token] = useLocalStorage(JWT_TOKEN_KEY_NAME)
  const { setIsLoggedInAction } = useAuth()
  const [selectedSymbol, setSelectedSymbol] = useState<any>({})
  const [error, setError] = useState('')

  const { wallet } = useWallet()

  const test = {
    symbol: '',
  }

  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      symbol: test?.symbol ? { label: test.symbol, value: test.symbol } : null,
    },
  })

  const symbol = watch('symbol')

  function handleSubmitForm(data: any) {
    console.log(data)
  }

  function getBaseAsset() {
    if (!wallet) return 0
    if (!selectedSymbol) return 0

    const baseAsset = wallet.find((w) => w.symbol === selectedSymbol.base_asset)
    if (!baseAsset) return 0

    return `${selectedSymbol.base_asset}: ${baseAsset.available}`
  }

  function getQuoteAsset() {
    if (!wallet) return 0
    if (!selectedSymbol) return 0

    const quoteAsset = wallet.find(
      (w) => w.symbol === selectedSymbol.quote_asset,
    )
    if (!quoteAsset) return 0

    return `${selectedSymbol.quote_asset}: ${quoteAsset.available}`
  }

  const fetchSymbol = useCallback(async () => {
    const result = await getSymbol(token, symbol?.value || '')

    if (!result.success) {
      return requestNotificationHandler(result, setIsLoggedInAction)
    }

    setSelectedSymbol(result.data)
  }, [symbol])

  useEffect(() => {
    if (!symbol) return
    fetchSymbol()
  }, [symbol])

  return (
    <main className="p-4 sm:ml-64 bg-gray-100 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 mt-14">
        <div className="col-span-1 md:col-span-12 mt-4">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Nova Ordem
          </h1>
        </div>
        <form
          className="col-span-1 md:col-span-12 grid mt-4 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          onSubmit={handleSubmit(handleSubmitForm)}
          autoComplete="off"
        >
          <div className="col-span-12 md:col-span-6 row-start-2 md:row-start-auto">
            <Controller
              name="symbol"
              control={control}
              render={({ field: { onChange, ref, value } }) => (
                <SelectSymbol
                  ref={ref}
                  id="symbol"
                  onChange={onChange}
                  value={value}
                  label="Par de moedas:"
                />
              )}
              rules={{ required: true }}
            />
          </div>
          <div className="col-span-12 md:col-span-6 row-start-1 md:row-start-auto">
            <SymbolPrice symbol={symbol?.value} />
          </div>
          <div className="col-span-1 md:col-span-6 mt-2">{getBaseAsset()}</div>
          <div className="col-span-1 md:col-span-6 mt-2">{getQuoteAsset()}</div>
          <div className="col-span-12 mt-4">
            <div className="flex flex-col md:flex-row">
              {error && (
                <FeedbackAlert
                  className="max-w-full"
                  message={error}
                  color="failure"
                  alertIcon={
                    <RiAlertFill className="w-5 h-5 fill-red-500 mr-2" />
                  }
                />
              )}
              <div className="w-full md:w-2/12 ml-auto">
                <Button type="submit">Enviar ordem</Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
