import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'

import { Label } from 'flowbite-react'
import Select, { Props as ReactSelectLibProps } from 'react-select'

import { useEnums } from '../hooks/useEnums'
import { ReactSelectProps } from '../interfaces/ReactSelectProps'

type SelectSymbolProps = ReactSelectLibProps & {
  id: string
  label?: string
  isOnlyFavorites?: boolean
  value?: ReactSelectProps | null
  disabled?: boolean
  error?:
    | {
        message: string
      }
    | undefined
}

export const SelectSymbol = forwardRef<any, SelectSymbolProps>(
  function SelectSymbol(
    { id, label, value, isOnlyFavorites = true, disabled = false, ...rest },
    ref,
  ) {
    const [filteredSymbols, setFilteredSymbols] = useState<ReactSelectProps[]>(
      [],
    )
    const [onlyFavorites, setOnlyFavorites] = useState(isOnlyFavorites)

    const { symbols } = useEnums()

    const filterSymbols = useCallback(() => {
      if (onlyFavorites) {
        const parsedList = symbols
          .filter((s) => s.isFavorite)
          .map((s) => s.symbol)
        setFilteredSymbols(parsedList)
      } else {
        const parsedList = symbols.map((s) => s.symbol)
        setFilteredSymbols(parsedList)
      }
    }, [onlyFavorites, symbols])

    useEffect(() => {
      filterSymbols()
    }, [onlyFavorites, symbols])

    const selectSymbol = useMemo(
      () => (
        <div className="flex flex-col">
          {!!label && (
            <Label
              htmlFor={id}
              value={label}
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            />
          )}
          <div className="flex flex-row items-center">
            <button
              className="flex items-center justify-center bg-amber-700 disabled:bg-amber-800 disabled:hover:bg-amber-800 hover:bg-amber-800 dark:bg-amber-600 disabled:dark:bg-gray-500 disabled:hover:dark:bg-gray-500 dark:hover:bg-amber-700 h-10 w-12 rounded-l-lg"
              onClick={() => {
                setOnlyFavorites(!onlyFavorites)
              }}
              type="button"
              disabled={disabled}
            >
              <svg
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className={`w-6 h-6 ${
                  disabled
                    ? 'fill-gray-200'
                    : onlyFavorites
                    ? 'fill-yellow-300'
                    : 'fill-gray-400'
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </button>
            <Select
              ref={ref}
              id={id}
              isSearchable
              placeholder="Selecione um Par"
              value={value}
              isDisabled={disabled}
              options={filteredSymbols}
              menuPortalTarget={document.body}
              menuPosition={'fixed'}
              styles={{
                menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                menu: (provided) => ({ ...provided, zIndex: 9999 }),
              }}
              classNames={{
                container: () =>
                  'shadow-sm rounded-r-lg focus:ring-blue-500 block w-full border border-gray-300 dark:border-gray-600',
                input: () =>
                  'bg-transparent text-gray-900 disabled:text-gray-700 disabled:dark:text-gray-400 text-sm dark:text-gray-50 input-react-select',
                control: () =>
                  'bg-gray-50 dark:bg-gray-700 shadow-sm rounded-r-lg focus:ring-blue-500  block w-full control-react-select-symbol',
                placeholder: () => 'dark:text-gray-400',
                singleValue: () => 'text-gray-700 dark:text-gray-300',
              }}
              {...rest}
            />
          </div>
        </div>
      ),
      [symbols, onlyFavorites, filteredSymbols, value, disabled],
    )

    return selectSymbol
  },
)
