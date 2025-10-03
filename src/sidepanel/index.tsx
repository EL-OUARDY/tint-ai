import React from 'react'
import ReactDOM from 'react-dom/client'
import { SidePanel } from './SidePanel'
import './index.css'
import { ThemeProvider } from '@/contexts/theme-provider'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="tintai-ui-theme">
      <SidePanel />
    </ThemeProvider>
  </React.StrictMode>,
)
