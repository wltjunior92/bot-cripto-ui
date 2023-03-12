import { Checkbox, CheckboxProps, Label } from 'flowbite-react'
import { forwardRef } from 'react'

type CheckboxInputProps = CheckboxProps & {
  id: string
  label: string
  side?: 'right' | 'left'
}

export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  function CheckboxInput({ id, label, side = 'left', ...rest }, ref) {
    return (
      <div className="flex items-center h-5">
        {side === 'right' && (
          <Label htmlFor={id} className="mr-2">
            {label}
          </Label>
        )}
        <Checkbox ref={ref} id={id} {...rest} />
        {side === 'left' && (
          <Label htmlFor={id} className="ml-2">
            {label}
          </Label>
        )}
      </div>
    )
  },
)
