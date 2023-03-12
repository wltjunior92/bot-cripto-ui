import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { ThemeContextProvider } from './contexts/ThemeContext'

import './global.css'
import { Router } from './Router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <BrowserRouter>
        <Router />
        <Toaster />
      </BrowserRouter>
    </ThemeContextProvider>
  </React.StrictMode>,
)
