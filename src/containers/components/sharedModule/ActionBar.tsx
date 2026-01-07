import { Button } from 'antd'
import { ReactNode } from 'react'
import './ActionBar.scss'

interface ActionBarButton {
  key: string
  label: string
  icon?: ReactNode
  onClick?: () => void
  type?: 'primary' | 'default'
  danger?: boolean
  disabled?: boolean
  color?: 'blue' | 'orange' // colores para llamar los estilos quemados de los submodulos (naranja y azul)
}
interface ActionBarProps {
  actions: ActionBarButton[]
  className?: string
}

export const ActionBar = ({ actions, className }: ActionBarProps) => {
  return (
    <div className={`action-bar ${className || ''}`}>
      {actions.map((action) => (
        <Button
          key={action.key}
          icon={action.icon}
          onClick={action.onClick}
          type={action.type}
          danger={action.danger}
          disabled={action.disabled}
          className={[
            action.type === 'primary' && action.color
              ? `ant-btn-primary-${action.color}`
              : '',
          ].join(' ')}
        >
          {action.label}
        </Button>
      ))}
    </div>
  )
}

export default ActionBar
