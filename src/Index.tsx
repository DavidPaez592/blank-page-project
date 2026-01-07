import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'

import 'antd/dist/reset.css'

const rootElement = document.getElementById('root')

rootElement
  ? createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  : console.error('ERROR', 'Root element not found')
