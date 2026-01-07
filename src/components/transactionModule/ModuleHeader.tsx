import { Checkbox, Col, DatePicker, Input, Row, Select } from 'antd'

import type { HeaderCheckbox, HeaderField, ModuleColors, ModuleHeaderConfig } from './types'

import './ModuleHeader.scss'

interface ModuleHeaderProps {
  config: ModuleHeaderConfig
  moduleColors: ModuleColors
  onCheckboxChange?: (name: string, checked: boolean) => void
  onFieldChange?: (name: string, value: unknown) => void
  values?: Record<string, unknown>
}

export const ModuleHeader = ({
  config,
  moduleColors,
  onCheckboxChange,
  onFieldChange,
  values = {},
}: ModuleHeaderProps) => {
  const renderField = (field: HeaderField) => {
    switch (field.type) {
      case 'date':
        return (
          <DatePicker
            onChange={(date) => onFieldChange?.(field.name, date)}
            placeholder={field.placeholder}
            style={{ width: field.width ?? '100%' }}
          />
        )
      case 'select':
        return (
          <Select
            onChange={(value) => onFieldChange?.(field.name, value)}
            options={field.options}
            placeholder={field.placeholder}
            style={{ width: field.width ?? '100%' }}
            value={values[field.name] as string}
          />
        )
      default:
        return (
          <Input
            onChange={(e) => onFieldChange?.(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={{ width: field.width ?? '100%' }}
            value={values[field.name] as string}
          />
        )
    }
  }

  const renderCheckbox = (checkbox: HeaderCheckbox) => (
    <Checkbox
      checked={values[checkbox.name] as boolean}
      key={checkbox.name}
      onChange={(e) => onCheckboxChange?.(checkbox.name, e.target.checked)}
    >
      {checkbox.label}
      {checkbox.hasInput && (
        <Input
          onChange={(e) => onFieldChange?.(`${checkbox.name}_value`, e.target.value)}
          placeholder={checkbox.inputPlaceholder}
          size="small"
          style={{ marginLeft: 8, width: 120 }}
          value={values[`${checkbox.name}_value`] as string}
        />
      )}
    </Checkbox>
  )

  return (
    <div
      className="module-header"
      style={
        {
          '--module-dark': moduleColors.dark,
          '--module-light': moduleColors.light,
          '--module-primary': moduleColors.primary,
        } as React.CSSProperties
      }
    >
      <div className="module-header__top">
        <div className="module-header__top-icon">{config.icon}</div>
        <h2 className="module-header__top-title">{config.title}</h2>
      </div>

      {config.fields.length > 0 && (
        <Row className="module-header__fields" gutter={[16, 8]}>
          {config.fields.map((field) => (
            <Col key={field.name} lg={6} md={8} sm={12} xs={24}>
              <label>{field.label}</label>
              {renderField(field)}
            </Col>
          ))}
        </Row>
      )}

      {config.checkboxes && config.checkboxes.length > 0 && (
        <div className="module-header__checkboxes">
          {config.checkboxes.map((checkbox) => renderCheckbox(checkbox))}
        </div>
      )}
    </div>
  )
}

export default ModuleHeader
