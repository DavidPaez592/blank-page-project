import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'

import 'antd/dist/reset.css'

console.log('Index.tsx loaded')

const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

rootElement
  ? createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  : console.error('ERROR', 'Root element not found')
