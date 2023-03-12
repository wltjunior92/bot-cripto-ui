import { Label, TextInput, TextInputProps } from 'flowbite-react'
import { forwardRef } from 'react'

type InputProps = TextInputProps & {
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
    <div>
      {!!label && (
        <Label
          htmlFor={id}
          value={label}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        />
      )}
      <TextInput ref={ref} id={id} placeholder="name@email.com" {...rest} />
      {error?.message !== '' && (
        <span className="text-xs font-medium text-red-500">
          {error?.message}
        </span>
      )}
    </div>
  )
})
