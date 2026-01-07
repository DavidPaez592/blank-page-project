import { ConfigProvider } from 'antd'
import esES from 'antd/locale/es_ES'
import type { ReactNode } from 'react'

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <ConfigProvider locale={esES}>{children}</ConfigProvider>
}
