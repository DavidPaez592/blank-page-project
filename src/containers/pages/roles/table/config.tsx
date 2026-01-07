import { TableColumnsType, Tooltip } from 'antd'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

import { getView } from '@/helpers'
import { IRole } from '@/interfaces'
import RoleTableActions from './actions'

export const RolesTableColumns: TableColumnsType<IRole> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
  },
  {
    title: 'Descripción',
    dataIndex: 'description',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    ellipsis: true,
  },
  {
    title: 'Código',
    dataIndex: 'code',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
  },
  {
    title: 'Modificable',
    dataIndex: 'modifiable',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    width: 100,
    render: (modifiable) =>
      modifiable ? (
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
    title: 'Eliminable',
    dataIndex: 'deletable',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    width: 100,
    render: (deletable) =>
      deletable ? (
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
    title: 'Acciones',
    align: 'center',
    key: 'actions',
    fixed: getView(window.innerWidth) === 'Desktop' ? 'right' : false,
    responsive: ['xs', 'sm', 'md', 'lg'],
    render: (data: IRole) => <RoleTableActions roleData={data} />,
  },
]
