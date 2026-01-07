import type { ColumnType } from 'antd/es/table'
import type { ReactNode } from 'react'

// ==================== TIPOS BASE ====================

export type ModuleVariant = 'danger' | 'primary' | 'secondary' | 'success' | 'warning'

export interface ModuleColors {
  dark: string
  gradient: string
  light: string
  primary: string
}

// Colores predefinidos por variante
export const MODULE_COLORS: Record<ModuleVariant, ModuleColors> = {
  danger: {
    dark: '#dc2626',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    light: '#fee2e2',
    primary: '#ef4444',
  },
  primary: {
    dark: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    light: '#dbeafe',
    primary: '#3b82f6',
  },
  secondary: {
    dark: '#c2410c',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    light: '#ffedd5',
    primary: '#f97316',
  },
  success: {
    dark: '#047857',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    light: '#d1fae5',
    primary: '#10b981',
  },
  warning: {
    dark: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    light: '#fef3c7',
    primary: '#f59e0b',
  },
}

// ==================== TABS ====================

export interface InnerTab {
  icon: ReactNode
  key: string
  label: string
}

// ==================== HEADER ====================

export interface SelectOption {
  label: string
  value: string
}

export interface HeaderField {
  label: string
  name: string
  options?: SelectOption[]
  placeholder?: string
  type: 'date' | 'input' | 'select'
  width?: string
}

export interface HeaderCheckbox {
  hasInput?: boolean
  inputPlaceholder?: string
  label: string
  name: string
}

export interface ModuleHeaderConfig {
  checkboxes?: HeaderCheckbox[]
  fields: HeaderField[]
  icon: ReactNode
  title: string
}

// ==================== SECCIONES ====================

export interface FieldColSpan {
  lg?: number
  md?: number
  sm?: number
  xs?: number
}

export interface FieldRules {
  message?: string
  required?: boolean
}

export interface FieldConfig {
  colSpan?: FieldColSpan
  disabled?: boolean | ((values: Record<string, unknown>) => boolean)
  label: string
  name: string
  options?: SelectOption[]
  placeholder?: string
  rules?: FieldRules
  type: 'checkbox' | 'date' | 'input' | 'number' | 'select'
}

export interface ConditionalField {
  condition: (values: Record<string, unknown>) => boolean
  fields: FieldConfig[]
}

export interface SectionConfig {
  checkboxLabel?: string
  conditionalFields?: ConditionalField[]
  customRender?: (values: Record<string, unknown>) => ReactNode
  fields: FieldConfig[]
  hasCheckbox?: boolean
  icon?: ReactNode
  isHighlight?: boolean
  key: string
  title: string
}

// ==================== SIDEBAR ====================

export interface StatConfig {
  format?: 'currency' | 'number' | 'percent'
  key: string
  label: string
  value: number | string
}

export interface SidebarButtonConfig {
  icon: ReactNode
  key: string
  label: string
  onClick?: () => void
}

export interface SidebarConfig {
  buttons?: SidebarButtonConfig[]
  stats: StatConfig[]
}

// ==================== ACCIONES ====================

export interface ActionButtonConfig {
  icon: ReactNode
  key: string
  label: string
  onClick?: () => void
  type?: 'danger' | 'default' | 'primary'
}

// ==================== LISTA ====================

export interface ListConfig<T = unknown> {
  columns: Array<ColumnType<T>>
  dataSource?: T[]
  rowKey?: string
}

// ==================== ADICIONALES ====================

export interface AdicionalSectionConfig {
  customRender?: () => ReactNode
  fields: FieldConfig[]
  key: string
  title: string
}

// ==================== MÓDULO COMPLETO ====================

export interface TransactionModuleConfig<T = unknown> {
  // Botones de acción
  actions: ActionButtonConfig[]
  // Tab de adicionales
  adicionales?: AdicionalSectionConfig[]
  // Tabs
  defaultTab?: string
  // Header
  header: ModuleHeaderConfig
  // Tab de lista
  list?: ListConfig<T>
  // Identificación
  moduleKey: string
  // Callbacks
  onDelete?: (id: number | string) => void
  onPrint?: (id: number | string) => void
  onSearch?: (values: Record<string, unknown>) => void
  onSubmit?: (values: Record<string, unknown>) => void
  // Secciones del formulario principal
  sections: SectionConfig[]
  // Sidebar
  sidebar?: SidebarConfig
  tabs: InnerTab[]
  variant: ModuleVariant
}
