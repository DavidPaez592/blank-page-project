import { AppProvider } from './providers/AppProvider'
import { Router } from '@/router/'

import 'nprogress/nprogress.css'

export const App: React.FC = (props) => {
  return (
    <AppProvider>
      <Router {...props} />
    </AppProvider>
  )
}
