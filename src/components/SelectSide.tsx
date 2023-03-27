import { useMemo } from 'react'

type SelectSideProps = {
  orderSide: string
  onAction: (value: 'buy' | 'sell') => void
}

export function SelectSide({ orderSide, onAction }: SelectSideProps) {
  const selectSide = useMemo(
    () => (
      <>
        <div className="col-span-2 flex mr-4 mb-1">
          <span className="text-gray-900 dark:text-white font-bold">
            Lado da operação:
          </span>
        </div>
        <button
          type="button"
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
                  ${
                    orderSide === 'buy'
                      ? `
                  hover:bg-emerald-700
                  border-gray-300
                  bg-emerald-600
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
                  dark:bg-gray-700
                  dark:border-gray-600
                  dark:text-white
                  dark:hover:text-white
                  dark:hover:bg-gray-600`
                  }
                  `}
          onClick={() => onAction('buy')}
        >
          Comprar
        </button>
        <button
          type="button"
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
                  ${
                    orderSide === 'sell'
                      ? `
                  hover:bg-red-700
                  border-gray-300
                  bg-red-600
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
                  dark:bg-gray-700
                  dark:border-gray-600
                  dark:text-white
                  dark:hover:text-white
                  dark:hover:bg-gray-600`
                  }
              `}
          onClick={() => onAction('sell')}
        >
          Vender
        </button>
      </>
    ),
    [orderSide],
  )

  return selectSide
}