import { IRoute } from '@/interfaces'
import { TableColumnsType, Tooltip } from 'antd'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import RouteTableActions from './actions'
import { ParamsState } from '@/state'

export const RoutesTableColumns: TableColumnsType<IRoute> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    align: 'center',
    responsive: ['lg'],
  },
  {
    title: 'Descripción',
    dataIndex: 'description',
    align: 'center',
    responsive: ['lg'],
    ellipsis: true,
  },
  {
    title: 'Path',
    dataIndex: 'path',
    align: 'center',
    responsive: ['lg'],
  },
  {
    title: 'Método',
    dataIndex: 'method',
    align: 'center',
    responsive: ['lg'],
  },
  {
    title: 'Privada',
    dataIndex: 'private',
    align: 'center',
    responsive: ['lg'],
    render: (isPrivate) =>
      isPrivate ? (
        <Tooltip title='Sí'>
          <FaCheckCircle size={20} color='green' />
        </Tooltip>
      ) : (
        <Tooltip title='No'>
          <FaTimesCircle size={20} color='red' />
        </Tooltip>
      ),
  },
  {
    title: 'Por defecto',
    dataIndex: 'default',
    align: 'center',
    responsive: ['lg'],
    render: (isDefault) =>
      isDefault ? (
        <FaCheckCircle size={20} color='green' />
      ) : (
        <FaTimesCircle size={20} color='red' />
      ),
  },
  {
    title: 'Permiso',
    dataIndex: 'permissionUId',
    align: 'center',
    responsive: ['lg'],
    render: (permissionUId) => {
      console.log(permissionUId, ParamsState.permissions.value)
      return ParamsState.permissions.value.find(
        (item) => item.uid === permissionUId
      )?.label
    },
  },
  {
    title: 'Menú',
    dataIndex: 'menuItemUId',
    align: 'center',
    responsive: ['lg'],
    render: (menuItemUId) =>
      ParamsState.menuItems.value.find((item) => item.value === menuItemUId)
        ?.label,
  },
  {
    title: 'Acciones',
    align: 'center',
    key: 'actions',
    fixed: 'right',
    responsive: ['lg'],
    render: (data: IRoute) => <RouteTableActions routeData={data} />,
  },
]
