import { TableColumnsType, Tag } from 'antd'

import { getView } from '@/helpers'
import { ETenantStatus, ITenant } from '@/interfaces'
import TenantTableActions from './actions'

const getTenantStatusConfig = (status?: ETenantStatus) => {
  switch (status) {
    case ETenantStatus.Active:
      return {
        color: 'green',
        text: 'Activo',
      }
    case ETenantStatus.Suspended:
      return {
        color: 'red',
        text: 'Suspendido',
      }
    case ETenantStatus.PendingSetup:
    default:
      return {
        color: 'orange',
        text: 'Pendiente por configurar',
      }
  }
}

export const TenantsTableColumns: TableColumnsType<ITenant> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    ellipsis: true,
    render: (status: ETenantStatus) => {
      const statusConfig = getTenantStatusConfig(status)
      return <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
    },
  },
  {
    title: 'Acciones',
    align: 'center',
    key: 'actions',
    fixed: getView(window.innerWidth) === 'Desktop' ? 'right' : false,
    responsive: ['xs', 'sm', 'md', 'lg'],
    render: (data: ITenant) => <TenantTableActions tenantData={data} />,
  },
]
