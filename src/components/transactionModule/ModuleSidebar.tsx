import { Button } from 'antd'

import type { ModuleColors, SidebarConfig, StatConfig } from './types'

import './ModuleSidebar.scss'

interface ModuleSidebarProps {
  config: SidebarConfig
  moduleColors: ModuleColors
}

const formatValue = (stat: StatConfig): string => {
  const value = stat.value

  switch (stat.format) {
    case 'currency':
      return typeof value === 'number'
        ? value.toLocaleString('es-CO', { currency: 'COP', style: 'currency' })
        : value
    case 'number':
      return typeof value === 'number' ? value.toLocaleString('es-CO') : value
    case 'percent':
      return typeof value === 'number' ? `${value.toFixed(2)}%` : value
    default:
      return String(value)
  }
}

export const ModuleSidebar = ({ config, moduleColors }: ModuleSidebarProps) => {
  return (
    <div
      className="module-sidebar"
      style={
        {
          '--module-dark': moduleColors.dark,
          '--module-light': moduleColors.light,
          '--module-primary': moduleColors.primary,
        } as React.CSSProperties
      }
    >
      <div className="module-sidebar__stats">
        {config.stats.map((stat, index) => (
          <div className="module-sidebar__stat" key={stat.key}>
            <span className="module-sidebar__stat-label">{stat.label}</span>
            <span
              className={`module-sidebar__stat-value ${index === config.stats.length - 1 ? 'module-sidebar__stat-value--highlight' : ''}`}
            >
              {formatValue(stat)}
            </span>
          </div>
        ))}
      </div>

      {config.buttons && config.buttons.length > 0 && (
        <>
          <div className="module-sidebar__divider" />
          <div className="module-sidebar__buttons">
            {config.buttons.map((button) => (
              <Button icon={button.icon} key={button.key} onClick={button.onClick}>
                {button.label}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ModuleSidebar
