import { Checkbox, Col, DatePicker, Input, InputNumber, Row, Select } from 'antd'

import type { FieldConfig, ModuleColors, SectionConfig } from './types'

import './ModuleSection.scss'

interface ModuleSectionProps {
  config: SectionConfig
  moduleColors: ModuleColors
  onCheckboxChange?: (checked: boolean) => void
  onFieldChange?: (name: string, value: unknown) => void
  sectionChecked?: boolean
  values?: Record<string, unknown>
}

export const ModuleSection = ({
  config,
  moduleColors,
  onCheckboxChange,
  onFieldChange,
  sectionChecked = false,
  values = {},
}: ModuleSectionProps) => {
  const renderField = (field: FieldConfig) => {
    const isDisabled =
      typeof field.disabled === 'function' ? field.disabled(values) : field.disabled

    switch (field.type) {
      case 'checkbox':
        return (
          <Checkbox
            checked={values[field.name] as boolean}
            disabled={isDisabled}
            onChange={(e) => onFieldChange?.(field.name, e.target.checked)}
          />
        )
      case 'date':
        return (
          <DatePicker
            disabled={isDisabled}
            onChange={(date) => onFieldChange?.(field.name, date)}
            placeholder={field.placeholder}
            style={{ width: '100%' }}
          />
        )
      case 'number':
        return (
          <InputNumber
            disabled={isDisabled}
            onChange={(value) => onFieldChange?.(field.name, value)}
            placeholder={field.placeholder}
            style={{ width: '100%' }}
            value={values[field.name] as number}
          />
        )
      case 'select':
        return (
          <Select
            disabled={isDisabled}
            onChange={(value) => onFieldChange?.(field.name, value)}
            options={field.options}
            placeholder={field.placeholder}
            style={{ width: '100%' }}
            value={values[field.name] as string}
          />
        )
      default:
        return (
          <Input
            disabled={isDisabled}
            onChange={(e) => onFieldChange?.(field.name, e.target.value)}
            placeholder={field.placeholder}
            value={values[field.name] as string}
          />
        )
    }
  }

  const getAllFields = (): Array<FieldConfig> => {
    let allFields = [...config.fields]

    if (config.conditionalFields) {
      for (const conditional of config.conditionalFields) {
        if (conditional.condition(values)) {
          allFields = [...allFields, ...conditional.fields]
        }
      }
    }

    return allFields
  }

  const fields = getAllFields()

  return (
    <div
      className={`module-section ${config.isHighlight ? 'module-section--highlight' : ''}`}
      style={
        {
          '--module-dark': moduleColors.dark,
          '--module-light': moduleColors.light,
          '--module-primary': moduleColors.primary,
        } as React.CSSProperties
      }
    >
      <div className="module-section__header">
        {config.icon && <div className="module-section__header-icon">{config.icon}</div>}
        <h3 className="module-section__header-title">{config.title}</h3>
        {config.hasCheckbox && (
          <Checkbox
            checked={sectionChecked}
            className="module-section__header-checkbox"
            onChange={(e) => onCheckboxChange?.(e.target.checked)}
          >
            {config.checkboxLabel}
          </Checkbox>
        )}
      </div>

      <div className="module-section__content">
        {config.customRender ? (
          config.customRender(values)
        ) : (
          <Row gutter={[16, 0]}>
            {fields.map((field) => (
              <Col
                key={field.name}
                lg={field.colSpan?.lg ?? 6}
                md={field.colSpan?.md ?? 8}
                sm={field.colSpan?.sm ?? 12}
                xs={field.colSpan?.xs ?? 24}
              >
                <div className="module-section__field">
                  <label>{field.label}</label>
                  {renderField(field)}
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  )
}

export default ModuleSection
