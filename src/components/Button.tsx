import {
  Button as FlowbiteButton,
  ButtonProps as FlowbiteButtonProps,
} from 'flowbite-react'

type ButtonProps = FlowbiteButtonProps & {
  variant?: 'primary' | 'secondary' | 'danger'
  customWidth?: string
}

export function Button({
  variant = 'primary',
  customWidth,
  children,
  ...rest
}: ButtonProps) {
  return (
    <FlowbiteButton
      className={`
        text-white
        ${
          variant === 'primary'
            ? `
          bg-primary-600
          hover:bg-primary-700
          focus:ring-primary-300
          dark:bg-primary-600
          dark:hover:bg-primary-700
          dark:focus:ring-primary-800
        `
            : variant === 'secondary'
            ? `
          bg-blue-600
          hover:bg-blue-700
          focus:ring-blue-300
          dark:bg-blue-600
          dark:hover:bg-blue-700
          dark:focus:ring-blue-800
        `
            : `
          bg-red-600
          hover:bg-red-700
          focus:ring-red-300
          dark:bg-red-600
          dark:hover:bg-red-700
          dark:focus:ring-red-800
        `
        }
        focus:ring-4
        focus:outline-none
        font-medium
        rounded-lg
        text-sm
        px-5
        text-center
        ${!customWidth ? 'w-full' : customWidth}
      `}
      {...rest}
    >
      {children}
    </FlowbiteButton>
  )
}
