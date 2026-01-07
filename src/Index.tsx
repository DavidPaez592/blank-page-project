import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'

import 'antd/dist/reset.css'

const rootElement = document.getElementById('root')

const safeText = (detail: unknown) => {
  if (typeof detail === 'string') return detail
  if (detail instanceof Error) {
    return `${detail.name}: ${detail.message}\n${detail.stack ?? ''}`
  }
  try {
    return JSON.stringify(detail, null, 2)
  } catch {
    return String(detail)
  }
}

const showFatal = (title: string, detail: unknown) => {
  if (!rootElement) return
  rootElement.innerHTML = `<pre style="padding:12px;white-space:pre-wrap;">${title}\n\n${safeText(detail)}</pre>`
}

window.addEventListener('error', (e) => {
  const ev = e as ErrorEvent
  showFatal('Error de la app', ev.error ?? ev.message)
})

window.addEventListener('unhandledrejection', (e) => {
  showFatal('Promesa rechazada', (e as PromiseRejectionEvent).reason)
})

if (!rootElement) {
  // eslint-disable-next-line no-console
  console.error('ERROR', 'Root element not found')
} else {
  rootElement.innerHTML =
    '<pre style="padding:12px;white-space:pre-wrap;">Cargando aplicación…</pre>'

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
