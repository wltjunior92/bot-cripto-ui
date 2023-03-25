import { useEffect, lazy, Suspense } from 'react'

import { Routes, Route, redirect } from 'react-router-dom'

import { ProtectedRoute } from './components/ProtectedRoute'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Login } from './pages/login'
import { JWT_TOKEN_KEY_NAME } from './utils/constants'

const Settings = lazy(() => import('./pages/Settings'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NewOrder = lazy(() => import('./pages/NewOrder'))

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
              <Suspense fallback={<>...</>}>
                <Settings />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<>...</>}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/new-order"
          element={
            <ProtectedRoute>
              <Suspense fallback={<>...</>}>
                <NewOrder />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
