import { forwardRef, useState } from 'react'
import { Label } from 'flowbite-react'
import Select from 'react-select'

type SelectQuoteProps = {
  id: string
  label?: string
  data: any[]
  error?:
    | {
        message: string
      }
    | undefined
}

export const SelectQuote = forwardRef<any, SelectQuoteProps>(
  function SelectQuote({ id, data, label }, ref) {
    const [animal, setAnimal] = useState(null)
    const handleChange = (value: any) => {
      console.log('value:', value)
      setAnimal(value)
    }

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
          isClearable
          placeholder="Selecione um Par"
          value={animal}
          onChange={handleChange}
          options={data}
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
