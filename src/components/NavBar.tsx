import { useState } from 'react'

import { Avatar } from 'flowbite-react'

import { DropdownItem } from './DropdownItem'
import { Logo } from './Logo'
import { ThemeSwitcherButton } from './ThemeSwitcherButton'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useNavBar } from '../hooks/useNavBar'
import { JWT_TOKEN_KEY_NAME } from '../utils/constants'

export function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { handleSetIsOpen, isOpen } = useNavBar()
  const { user } = useAuth()
  const [, , removeToken] = useLocalStorage(JWT_TOKEN_KEY_NAME)

  function handleLogout() {
    removeToken()
    setIsDropdownOpen(false)
    window.location.reload()
  }

  function handleToggleSidebar() {
    handleSetIsOpen(!isOpen)
  }

  function getNameInitials(name: string) {
    const [first, seccond] = name.split(' ')
    if (!seccond) {
      return first.substring(0, 2).toUpperCase()
    } else {
      return `${first.substring(0, 1)}${seccond.substring(0, 1)}`.toUpperCase()
    }
  }

  return (
    <nav className="fixed top-0 z-50 w-screen bg-gray-700 border-b border-gray-500 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={handleToggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <Logo />
          </div>
          <div className="flex items-center">
            <div className="flex items-center ml-3">
              <div className="flex flex-row space-x-2">
                <ThemeSwitcherButton />
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <Avatar
                    rounded
                    {...(user && {
                      placeholderInitials: getNameInitials(user.name),
                    })}
                  />
                </button>
              </div>
              <div
                className={`z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 ${
                  !isDropdownOpen ? 'hidden' : 'block'
                }`}
                id="dropdown-user"
                style={{
                  position: 'absolute',
                  inset: '0px auto auto 0px',
                  margin: 0,
                  transform: !isDropdownOpen
                    ? 'translate(341px, 58px)'
                    : 'translate(calc(100vw - 200px), 58px)',
                }}
                data-popper-placement="bottom"
              >
                <div className="px-4 py-3" role="none">
                  <p
                    className="text-sm text-gray-900 dark:text-white"
                    role="none"
                  >
                    {user?.name}
                  </p>
                  <p
                    className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                    role="none"
                  >
                    {user?.email}
                  </p>
                </div>
                <ul className="py-1" role="none">
                  <DropdownItem
                    to="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </DropdownItem>
                  <DropdownItem to="#" onClick={handleLogout}>
                    Sign out
                  </DropdownItem>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
