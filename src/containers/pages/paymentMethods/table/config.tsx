import { TableColumnsType } from 'antd'

import { getView } from '@/helpers'
import { IPaymentMethod } from '@/interfaces'
import PaymentMethodsTableActions from './actions'

export const PaymentMethodsTableColumns: TableColumnsType<IPaymentMethod> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    ellipsis: true,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Descripción',
    dataIndex: 'description',
    align: 'center',
    responsive: ['md', 'lg'],
    ellipsis: true,
    render: (description: string) => (
      <span style={{ color: '#6b7280' }}>
        {description || 'Sin descripción'}
      </span>
    ),
  },
  {
    title: 'Fecha de Creación',
    dataIndex: 'createdAt',
    align: 'center',
    responsive: ['lg'],
    width: 150,
    render: (createdAt: string) => {
      if (!createdAt) return '-'
      const date = new Date(createdAt)
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    },
    sorter: (a, b) => {
      if (!a.createdAt || !b.createdAt) return 0
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    },
  },
  {
    title: 'Acciones',
    align: 'center',
    key: 'actions',
    fixed: getView(window.innerWidth) === 'Desktop' ? 'right' : false,
    responsive: ['xs', 'sm', 'md', 'lg'],
    width: 120,
    render: (data: IPaymentMethod) => (
      <PaymentMethodsTableActions paymentMethodData={data} />
    ),
  },
]
