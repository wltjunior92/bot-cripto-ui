import { ReactElement, ReactNode } from 'react'

import { Link } from 'react-router-dom'

import { useNavBar } from '../hooks/useNavBar'

type SidebarItemProps = {
  children: ReactNode
  icon: ReactElement
  link: string
}

export function SidebarItem({ children, icon, link }: SidebarItemProps) {
  const { handleSetIsOpen } = useNavBar()
  return (
    <li>
      <Link
        to={link}
        className="flex items-center p-2 text-base font-normal text-gray-50 rounded-lg hover:text-gray-50 hover:bg-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-50"
        onClick={() => handleSetIsOpen(false)}
      >
        <>
          {icon}
          <span className="ml-3">{children}</span>
        </>
      </Link>
    </li>
  )
}
