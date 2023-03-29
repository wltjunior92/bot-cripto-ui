import { forwardRef, HTMLProps, ReactNode, useMemo } from 'react'

import { Label } from 'flowbite-react'

type SelectProps = HTMLProps<HTMLSelectElement> & {
  id: string
  label?: string
  error?:
    | {
        message: string
      }
    | undefined
  children: ReactNode[] | ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ id, label, error, children, ...rest }, ref) {
    const select = useMemo(
      () => (
        <>
          {!!label && (
            <Label
              htmlFor={id}
              value={label}
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            />
          )}
          <select
            ref={ref}
            id={id}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...rest}
          >
            {children}
          </select>
          {error?.message !== '' && (
            <span className="text-xs font-medium text-red-500">
              {error?.message}
            </span>
          )}
        </>
      ),
      [error],
    )

    return select
  },
)
