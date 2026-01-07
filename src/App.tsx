import { AppProvider } from './providers/AppProvider'
import { Router } from '@/router/'
import { ErrorBoundary } from '@/containers/views/errorBoundary'

import 'nprogress/nprogress.css'

export const App: React.FC = (props) => {
  return (
    <AppProvider>
      <ErrorBoundary>
        <Router {...props} />
      </ErrorBoundary>
    </AppProvider>
  )
}
