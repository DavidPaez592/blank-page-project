import { useState } from 'react'

import type { ModuleColors, TransactionModuleConfig } from './types'
import { MODULE_COLORS } from './types'

import ModuleActions from './ModuleActions'
import ModuleHeader from './ModuleHeader'
import ModuleSection from './ModuleSection'
import ModuleSidebar from './ModuleSidebar'

import './TransactionModule.scss'

interface TransactionModuleProps<T = unknown> {
  config: TransactionModuleConfig<T>
  initialValues?: Record<string, unknown>
  onValuesChange?: (values: Record<string, unknown>) => void
}

export const TransactionModule = <T = unknown,>({
  config,
  initialValues = {},
  onValuesChange,
}: TransactionModuleProps<T>) => {
  const [activeTab, setActiveTab] = useState(config.defaultTab ?? config.tabs[0]?.key)
  const [values, setValues] = useState<Record<string, unknown>>(initialValues)
  const [sectionChecks, setSectionChecks] = useState<Record<string, boolean>>({})

  const moduleColors: ModuleColors = MODULE_COLORS[config.variant]

  const handleFieldChange = (name: string, value: unknown) => {
    const newValues = { ...values, [name]: value }
    setValues(newValues)
    onValuesChange?.(newValues)
  }

  const handleSectionCheckChange = (sectionKey: string, checked: boolean) => {
    setSectionChecks({ ...sectionChecks, [sectionKey]: checked })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    handleFieldChange(name, checked)
  }

  return (
    <div
      className="transaction-module"
      style={
        {
          '--module-dark': moduleColors.dark,
          '--module-gradient': moduleColors.gradient,
          '--module-light': moduleColors.light,
          '--module-primary': moduleColors.primary,
        } as React.CSSProperties
      }
    >
      {/* Tabs */}
      <div className="transaction-module__tabs">
        {config.tabs.map((tab) => (
          <button
            className={`transaction-module__tab ${activeTab === tab.key ? 'transaction-module__tab--active' : ''}`}
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="transaction-module__content">
        <div className="transaction-module__main">
          {/* Header */}
          <ModuleHeader
            config={config.header}
            moduleColors={moduleColors}
            onCheckboxChange={handleCheckboxChange}
            onFieldChange={handleFieldChange}
            values={values}
          />

          {/* Secciones */}
          {config.sections.map((section) => (
            <ModuleSection
              config={section}
              key={section.key}
              moduleColors={moduleColors}
              onCheckboxChange={(checked) => handleSectionCheckChange(section.key, checked)}
              onFieldChange={handleFieldChange}
              sectionChecked={sectionChecks[section.key]}
              values={values}
            />
          ))}

          {/* Acciones */}
          <ModuleActions buttons={config.actions} />
        </div>

        {/* Sidebar */}
        {config.sidebar && (
          <div className="transaction-module__sidebar">
            <ModuleSidebar config={config.sidebar} moduleColors={moduleColors} />
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionModule
