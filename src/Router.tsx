import { useEffect } from 'react'
import { Routes, Route, redirect } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/login'
import { Settings } from './pages/Settings'
import { JWT_TOKEN_KEY_NAME } from './utils/constants'

export function Router() {
  const isAuthenticated = localStorage.getItem(JWT_TOKEN_KEY_NAME)

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/')
    }
  }, [isAuthenticated])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/" element={<DefaultLayout />}>
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
