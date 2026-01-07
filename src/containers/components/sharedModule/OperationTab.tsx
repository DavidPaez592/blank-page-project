import { ReactNode } from 'react'
import './OperationTab.scss'

interface OperationTabProps {
  subModuleType: string // 'traslado' | 'provision' propiedad que aplica el respectivo estilo quemado en el css
  tittle: string
  isActive: boolean
  onClick: () => void
  icon: ReactNode
}

export const OperationTab = ({
  subModuleType,
  isActive,
  tittle,
  onClick,
  icon,
}: OperationTabProps) => {
  return (
    <button
      className={`operation-tab operation-tab--${subModuleType} ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className='operation-tab__icon'>{icon}</span>
      <span>{tittle}</span>
    </button>
  )
}

export default OperationTab
