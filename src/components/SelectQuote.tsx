import { forwardRef } from 'react'

import { Label } from 'flowbite-react'
import Select from 'react-select'

import { useEnums } from '../hooks/useEnums'
import { ReactSelectProps } from '../interfaces/ReactSelectProps'

type SelectQuoteProps = {
  id: string
  label?: string
  onChange: (value: any) => void
  value?: ReactSelectProps
  error?:
    | {
        message: string
      }
    | undefined
}

export const SelectQuote = forwardRef<any, SelectQuoteProps>(
  function SelectQuote({ id, label, onChange, value }, ref) {
    const { quotes } = useEnums()

    return (
      <div className="flex flex-col">
        {!!label && (
          <Label
            htmlFor={id}
            value={label}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          />
        )}
        <Select
          ref={ref}
          id={id}
          isSearchable
          placeholder="Selecione um Par"
          defaultValue={value}
          onChange={onChange}
          value={value}
          options={quotes}
          menuPortalTarget={document.body}
          menuPosition={'fixed'}
          styles={{
            menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
          classNames={{
            container: () =>
              'shadow-sm  rounded-lg focus:ring-blue-500 block w-full border border-gray-300 dark:border-gray-600',
            input: () =>
              'bg-transparent text-gray-900 disabled:text-gray-700 dark:disabled:text-gray-400 text-sm dark:text-gray-50 input-react-select',
            control: () =>
              'bg-gray-50 dark:bg-gray-700 shadow-sm rounded-lg focus:ring-blue-500  block w-full control-react-select',
            placeholder: () => 'dark:text-gray-400',
            singleValue: () => 'text-gray-700 dark:text-gray-300',
            // valueContainer: () => 'bg-red-600',
          }}
        />
      </div>
    )
  },
)
