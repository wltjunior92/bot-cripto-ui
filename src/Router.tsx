import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/login'
import { Settings } from './pages/Settings'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}
