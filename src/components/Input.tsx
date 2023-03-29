import { forwardRef, HTMLProps } from 'react'

import { Label } from 'flowbite-react'

type InputProps = HTMLProps<HTMLInputElement> & {
  id: string
  label?: string
  error?:
    | {
        message: string
      }
    | undefined
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, error, ...rest },
  ref,
) {
  return (
    <>
      {!!label && (
        <Label
          htmlFor={id}
          value={label}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        />
      )}
      <input
        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 disabled:text-gray-700 dark:disabled:text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-50 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        ref={ref}
        id={id}
        {...rest}
      />
      {error?.message !== '' && (
        <span className="text-xs font-medium text-red-500">
          {error?.message}
        </span>
      )}
    </>
  )
})
