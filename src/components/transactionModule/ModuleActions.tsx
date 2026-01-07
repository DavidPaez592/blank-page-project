import { Button } from 'antd'

import type { ActionButtonConfig } from './types'

import './ModuleActions.scss'

interface ModuleActionsProps {
  buttons: Array<ActionButtonConfig>
}

export const ModuleActions = ({ buttons }: ModuleActionsProps) => {
  return (
    <div className="module-actions">
      {buttons.map((button) => (
        <Button
          danger={button.type === 'danger'}
          icon={button.icon}
          key={button.key}
          onClick={button.onClick}
          type={button.type === 'primary' ? 'primary' : 'default'}
        >
          {button.label}
        </Button>
      ))}
    </div>
  )
}

export default ModuleActions
