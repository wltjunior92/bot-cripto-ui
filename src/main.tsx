import React from 'react'

import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import { EnumsDataProvider } from './contexts/EnumsDataContext'
import { ThemeContextProvider } from './contexts/ThemeContext'
import './global.css'
import { Router } from './Router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeContextProvider>
    <AuthProvider>
      <EnumsDataProvider>
        <BrowserRouter>
          <Toaster />
          <Router />
        </BrowserRouter>
      </EnumsDataProvider>
    </AuthProvider>
  </ThemeContextProvider>,
)
