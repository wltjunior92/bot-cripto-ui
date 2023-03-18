import { ReactNode } from 'react'
import { Link, LinkProps } from 'react-router-dom'

type DropdownItemProps = LinkProps & {
  children: ReactNode
}

export function DropdownItem({ children, ...rest }: DropdownItemProps) {
  return (
    <li>
      <Link
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
        role="menuitem"
        {...rest}
      >
        {children}
      </Link>
    </li>
  )
}
