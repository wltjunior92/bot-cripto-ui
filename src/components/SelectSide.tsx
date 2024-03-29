import { useMemo } from 'react'

type SelectSideProps = {
  orderSide: string
  onAction: (value: 'BUY' | 'SELL') => void
  isDisabled?: boolean
}

export function SelectSide({
  orderSide,
  onAction,
  isDisabled = false,
}: SelectSideProps) {
  const selectSide = useMemo(
    () => (
      <>
        <div className="col-span-2 flex mr-4 mb-2">
          <span className="text-gray-900 dark:text-white font-semibold">
            Lado da operação:
          </span>
        </div>
        <button
          type="button"
          disabled={isDisabled}
          className={`
                  inline-flex
                  items-center
                  justify-center
                  px-4
                  py-2
                  text-sm
                  font-medium
                  border
                  border-r-0
                  rounded-l-lg
                  disabled:cursor-not-allowed
                  ${
                    orderSide === 'BUY'
                      ? `
                  hover:bg-emerald-700
                  border-gray-300
                  bg-emerald-600
                  disabled:bg-emerald-600
                  disabled:dark:bg-emerald-600
                  dark:bg-emerald-600
                  dark:border-gray-600
                  text-white
                  dark:hover:text-white
                  dark:hover:bg-emerald-700
                  `
                      : `
                  hover:bg-gray-100
                  border-gray-300
                  text-gray-900
                  bg-gray-200
                  disabled:bg-gray-200
                  disabled:dark:bg-gray-700
                  dark:bg-gray-700
                  dark:border-gray-600
                  dark:text-white
                  dark:hover:text-white
                  dark:hover:bg-gray-600`
                  }
                  `}
          onClick={() => onAction('BUY')}
        >
          Comprar
        </button>
        <button
          type="button"
          disabled={isDisabled}
          className={`
                  inline-flex
                  items-center
                  justify-center
                  px-4
                  py-2
                  text-sm
                  font-medium
                  border
                  rounded-r-lg
                  disabled:cursor-not-allowed
                  ${
                    orderSide === 'SELL'
                      ? `
                  hover:bg-red-700
                  border-gray-300
                  bg-red-600
                  disabled:bg-red-600
                  disabled:dark:bg-red-600
                  dark:bg-red-600
                  dark:border-gray-600
                  text-white
                  dark:hover:text-white
                  dark:hover:bg-red-700
                  `
                      : `
                  hover:bg-gray-100
                  border-gray-300
                  text-gray-900
                  bg-gray-200
                  disabled:bg-gray-200
                  disabled:dark:bg-gray-700
                  dark:bg-gray-700
                  dark:border-gray-600
                  dark:text-white
                  dark:hover:text-white
                  dark:hover:bg-gray-600`
                  }
              `}
          onClick={() => onAction('SELL')}
        >
          Vender
        </button>
      </>
    ),
    [orderSide],
  )

  return selectSide
}
