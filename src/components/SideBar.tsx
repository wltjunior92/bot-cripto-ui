import { useNavBar } from '../hooks/useNavBar'
import { FaChartPie, FaCogs, FaRobot, FaMoneyCheckAlt } from 'react-icons/fa'
import { SidebarItem } from './SidebarItem'

export function SideBar() {
  const { isOpen } = useNavBar()
  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-stone-300 border-b border-stone-400 border-r sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 ${
        !isOpen ? '-translate-x-full' : 'transform-none'
      }`}
      aria-label="Sidebar"
      {...(!isOpen
        ? { 'aria-hidden': true }
        : { 'aria-modal': true, role: 'dialog' })}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-stone-300 dark:bg-gray-800">
        <ul className="space-y-2">
          <SidebarItem
            icon={
              <FaChartPie className="w-6 h-6 text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            }
            link="/dashboard"
          >
            Dashboard
          </SidebarItem>
          <SidebarItem
            icon={
              <FaRobot className="w-6 h-6 text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            }
            link="/automations"
          >
            Automações
          </SidebarItem>
          <SidebarItem
            icon={
              <FaMoneyCheckAlt className="w-6 h-6 text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            }
            link="/orders"
          >
            Ordens
          </SidebarItem>
          <SidebarItem
            icon={
              <FaCogs className="w-6 h-6 text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            }
            link="/settings"
          >
            Configurações
          </SidebarItem>
        </ul>
      </div>
    </aside>
  )
}
