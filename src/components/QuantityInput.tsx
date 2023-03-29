import { forwardRef, HTMLProps } from 'react'

import { Label } from 'flowbite-react'

import { SymbolDTO } from '../dtos/userDTO'
import { WalletProp } from '../hooks/useWallet'

type QuantityInputProps = HTMLProps<HTMLInputElement> & {
  id: string
  label?: string
  symbol?: SymbolDTO
  wallet?: WalletProp[]
  onCalc: (value: string) => void
  side: string
  price: string
  error?:
    | {
        message: string
      }
    | undefined
}

export const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(
  function QuantityInput(
    { id, label, symbol, wallet, onCalc, side, price, error, ...rest },
    ref,
  ) {
    function handleCalcQuantity() {
      if (!wallet || !symbol) return

      let qty
      if (side === 'sell') {
        const baseAsset = wallet.find((w) => w.symbol === symbol.base_asset)
        if (!baseAsset) return
        qty = parseFloat(baseAsset.available)
      } else {
        const quoteAsset = wallet.find((w) => w.symbol === symbol.quote_asset)

        if (!quoteAsset) return
        const quoteAmount = parseFloat(quoteAsset?.available)

        if (!quoteAmount) return
        qty = quoteAmount / parseFloat(price)
      }

      if (!qty) return

      onCalc(`${qty}`)
    }

    function getPlaceholder() {
      if (symbol && symbol.min_lot_size) {
        return `Min.: ${symbol.min_lot_size}`
      }
      return ''
    }

    return (
      <>
        {!!label && (
          <Label
            htmlFor={id}
            value={label}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          />
        )}
        <div className="flex flex-row items-center">
          <div className="rounded-l-lg overflow-hidden border border-gray-300 dark:border-gray-600 border-r-0">
            <button
              className="flex items-center justify-center bg-amber-700 disabled:bg-amber-800 disabled:hover:bg-amber-800 hover:bg-amber-800 dark:bg-amber-600 disabled:dark:bg-gray-500 disabled:hover:dark:bg-gray-500 dark:hover:bg-amber-700 h-10 w-12"
              type="button"
              onClick={handleCalcQuantity}
              tabIndex={-1}
            >
              <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="w-7 h-7 fill-gray-100"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z"
                />
              </svg>
            </button>
          </div>
          <input
            className="shadow-sm  border border-gray-300 dark:border-gray-600 bg-gray-50  text-gray-900 disabled:text-gray-700 dark:disabled:text-gray-400 text-sm rounded-r-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-gray-50 dark:focus:ring-blue-500"
            placeholder={getPlaceholder()}
            ref={ref}
            id={id}
            {...rest}
          />
        </div>
        {error?.message !== '' && (
          <span className="text-xs font-medium text-red-500">
            {error?.message}
          </span>
        )}
      </>
    )
  },
)
