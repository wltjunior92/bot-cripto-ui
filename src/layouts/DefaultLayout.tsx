import { Outlet } from 'react-router-dom'

import { NavBar } from '../components/NavBar'
import { SideBar } from '../components/SideBar'
import { NavBarProvider } from '../contexts/NavBarContext'

export function DefaultLayout() {
  return (
    <>
      <NavBarProvider>
        <NavBar />
        <SideBar />
      </NavBarProvider>
      <Outlet />
    </>
  )
}
