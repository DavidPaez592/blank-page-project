/**
 * Este archivo contiene ejemplos de configuración para usar el componente TransactionModule.
 * Puedes copiar y adaptar estas configuraciones para crear nuevos módulos.
 */

import {
  CalendarOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  PrinterOutlined,
  SaveOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons'

import type { TransactionModuleConfig } from './types'

// ==================== EJEMPLO: MÓDULO DE VENTA ====================

export const ventaConfig: TransactionModuleConfig = {
  actions: [
    {
      icon: <SaveOutlined />,
      key: 'save',
      label: 'Guardar',
      type: 'primary',
    },
    {
      icon: <EditOutlined />,
      key: 'edit',
      label: 'Editar',
    },
    {
      icon: <PrinterOutlined />,
      key: 'print',
      label: 'Imprimir',
    },
    {
      icon: <DeleteOutlined />,
      key: 'delete',
      label: 'Eliminar',
      type: 'danger',
    },
  ],
  defaultTab: 'operacion',
  header: {
    checkboxes: [
      {
        hasInput: true,
        inputPlaceholder: 'Código',
        label: 'Código de Moneda',
        name: 'codigoMoneda',
      },
    ],
    fields: [
      {
        label: 'Cliente',
        name: 'cliente',
        placeholder: 'Seleccione cliente',
        type: 'select',
      },
      {
        label: 'Fecha',
        name: 'fecha',
        placeholder: 'Seleccione fecha',
        type: 'date',
      },
      {
        label: 'Referencia',
        name: 'referencia',
        placeholder: 'Número de referencia',
        type: 'input',
      },
    ],
    icon: <ShoppingCartOutlined />,
    title: 'Venta de Divisas',
  },
  moduleKey: 'venta',
  sections: [
    {
      fields: [
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Tipo de Documento',
          name: 'tipoDocumento',
          options: [
            { label: 'CC', value: 'CC' },
            { label: 'NIT', value: 'NIT' },
          ],
          type: 'select',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Número de Documento',
          name: 'numeroDocumento',
          placeholder: 'Ingrese número',
          type: 'input',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Nombre',
          name: 'nombre',
          placeholder: 'Nombre del cliente',
          type: 'input',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Teléfono',
          name: 'telefono',
          placeholder: 'Teléfono',
          type: 'input',
        },
      ],
      icon: <UserOutlined />,
      key: 'cliente',
      title: 'Datos del Cliente',
    },
    {
      fields: [
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Moneda',
          name: 'moneda',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
          ],
          type: 'select',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Cantidad',
          name: 'cantidad',
          placeholder: '0.00',
          type: 'number',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Tasa',
          name: 'tasa',
          placeholder: '0.00',
          type: 'number',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          disabled: true,
          label: 'Total COP',
          name: 'totalCOP',
          type: 'number',
        },
      ],
      icon: <DollarOutlined />,
      isHighlight: true,
      key: 'divisa',
      title: 'Información de Divisa',
    },
  ],
  sidebar: {
    buttons: [
      {
        icon: <SearchOutlined />,
        key: 'search',
        label: 'Buscar',
      },
      {
        icon: <CalendarOutlined />,
        key: 'history',
        label: 'Historial',
      },
    ],
    stats: [
      { format: 'currency', key: 'subtotal', label: 'Subtotal', value: 0 },
      { format: 'number', key: 'comision', label: 'Comisión', value: 0 },
      { format: 'currency', key: 'total', label: 'TOTAL', value: 0 },
    ],
  },
  tabs: [
    {
      icon: <ShoppingCartOutlined />,
      key: 'operacion',
      label: 'Operación',
    },
    {
      icon: <SearchOutlined />,
      key: 'lista',
      label: 'Lista',
    },
    {
      icon: <EditOutlined />,
      key: 'adicionales',
      label: 'Adicionales',
    },
  ],
  variant: 'secondary', // Naranja para venta
}

// ==================== EJEMPLO: MÓDULO DE COMPRA ====================

export const compraConfig: TransactionModuleConfig = {
  actions: [
    {
      icon: <SaveOutlined />,
      key: 'save',
      label: 'Guardar',
      type: 'primary',
    },
    {
      icon: <EditOutlined />,
      key: 'edit',
      label: 'Editar',
    },
    {
      icon: <PrinterOutlined />,
      key: 'print',
      label: 'Imprimir',
    },
    {
      icon: <DeleteOutlined />,
      key: 'delete',
      label: 'Eliminar',
      type: 'danger',
    },
  ],
  defaultTab: 'operacion',
  header: {
    checkboxes: [
      {
        hasInput: true,
        inputPlaceholder: 'Código',
        label: 'Código de Moneda',
        name: 'codigoMoneda',
      },
    ],
    fields: [
      {
        label: 'Cliente',
        name: 'cliente',
        placeholder: 'Seleccione cliente',
        type: 'select',
      },
      {
        label: 'Fecha',
        name: 'fecha',
        placeholder: 'Seleccione fecha',
        type: 'date',
      },
      {
        label: 'Referencia',
        name: 'referencia',
        placeholder: 'Número de referencia',
        type: 'input',
      },
    ],
    icon: <ShoppingOutlined />,
    title: 'Compra de Divisas',
  },
  moduleKey: 'compra',
  sections: [
    {
      fields: [
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Tipo de Documento',
          name: 'tipoDocumento',
          options: [
            { label: 'CC', value: 'CC' },
            { label: 'NIT', value: 'NIT' },
          ],
          type: 'select',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Número de Documento',
          name: 'numeroDocumento',
          placeholder: 'Ingrese número',
          type: 'input',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Nombre',
          name: 'nombre',
          placeholder: 'Nombre del cliente',
          type: 'input',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Teléfono',
          name: 'telefono',
          placeholder: 'Teléfono',
          type: 'input',
        },
      ],
      icon: <UserOutlined />,
      key: 'cliente',
      title: 'Datos del Cliente',
    },
    {
      fields: [
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Moneda',
          name: 'moneda',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
          ],
          type: 'select',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Cantidad',
          name: 'cantidad',
          placeholder: '0.00',
          type: 'number',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          label: 'Tasa',
          name: 'tasa',
          placeholder: '0.00',
          type: 'number',
        },
        {
          colSpan: { lg: 6, md: 8, sm: 12, xs: 24 },
          disabled: true,
          label: 'Total COP',
          name: 'totalCOP',
          type: 'number',
        },
      ],
      icon: <DollarOutlined />,
      isHighlight: true,
      key: 'divisa',
      title: 'Información de Divisa',
    },
  ],
  sidebar: {
    buttons: [
      {
        icon: <SearchOutlined />,
        key: 'search',
        label: 'Buscar',
      },
      {
        icon: <CalendarOutlined />,
        key: 'history',
        label: 'Historial',
      },
    ],
    stats: [
      { format: 'currency', key: 'subtotal', label: 'Subtotal', value: 0 },
      { format: 'number', key: 'comision', label: 'Comisión', value: 0 },
      { format: 'currency', key: 'total', label: 'TOTAL', value: 0 },
    ],
  },
  tabs: [
    {
      icon: <ShoppingOutlined />,
      key: 'operacion',
      label: 'Operación',
    },
    {
      icon: <SearchOutlined />,
      key: 'lista',
      label: 'Lista',
    },
    {
      icon: <EditOutlined />,
      key: 'adicionales',
      label: 'Adicionales',
    },
  ],
  variant: 'primary', // Azul para compra
}

// ==================== CÓMO USAR ====================

/**
 * EJEMPLO DE USO EN UN COMPONENTE:
 *
 * import { TransactionModule, compraConfig } from '@/components/transactionModule'
 *
 * const CompraPage = () => {
 *   const handleValuesChange = (values: Record<string, unknown>) => {
 *     console.log('Valores actualizados:', values)
 *     // Calcular totales, validar, etc.
 *   }
 *
 *   // Puedes modificar la configuración base
 *   const config = {
 *     ...compraConfig,
 *     onSubmit: (values) => {
 *       console.log('Guardar:', values)
 *     },
 *   }
 *
 *   return (
 *     <TransactionModule
 *       config={config}
 *       onValuesChange={handleValuesChange}
 *       initialValues={{ moneda: 'USD' }}
 *     />
 *   )
 * }
 */
