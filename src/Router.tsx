import { useEffect, lazy, Suspense } from 'react'

import { Routes, Route, redirect } from 'react-router-dom'

import { ProtectedRoute } from './components/ProtectedRoute'
import { DefaultLayout } from './layouts/DefaultLayout'
import { Login } from './pages/login'
import { JWT_TOKEN_KEY_NAME } from './utils/constants'

const Settings = lazy(() => import('./pages/Settings'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Orders = lazy(() => import('./pages/Orders'))
const AddOrViewOrder = lazy(() => import('./pages/AddOrViewOrder'))
const Monitors = lazy(() => import('./pages/Monitors'))

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
          path="/orders"
          element={
            <ProtectedRoute>
              <Suspense fallback={<>...</>}>
                <Orders />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/new-order"
          element={
            <ProtectedRoute>
              <Suspense fallback={<>...</>}>
                <AddOrViewOrder />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/edit/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<>...</>}>
                <AddOrViewOrder />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/monitors"
          element={
            <ProtectedRoute>
              <Suspense fallback={<>...</>}>
                <Monitors />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
