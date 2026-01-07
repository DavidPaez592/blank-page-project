import { IPermission } from '@/interfaces'
import { TableColumnsType } from 'antd'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import PermissionsTableActions from './actions'

export const PermissionsTableColumns: TableColumnsType<IPermission> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
  },
  {
    title: 'Código',
    dataIndex: 'code',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
  },
  {
    title: 'Descripción',
    dataIndex: 'description',
    align: 'center',
    ellipsis: true,
    responsive: ['xs', 'sm', 'md', 'lg'],
  },
  {
    title: 'Solo desarrollo',
    dataIndex: 'onlyDev',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    render: (onlyDev) =>
      onlyDev ? (
        <FaCheckCircle size={20} color='green' />
      ) : (
        <FaTimesCircle size={20} color='red' />
      ),
  },
  {
    title: 'Modificable',
    dataIndex: 'modifiable',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    render: (modifiable) =>
      modifiable ? (
        <FaCheckCircle size={20} color='green' />
      ) : (
        <FaTimesCircle size={20} color='red' />
      ),
  },
  {
    title: 'Eliminable',
    dataIndex: 'deletable',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    render: (deletable) =>
      deletable ? (
        <FaCheckCircle size={20} color='green' />
      ) : (
        <FaTimesCircle size={20} color='red' />
      ),
  },
  {
    title: 'Acciones',
    align: 'center',
    key: 'actions',
    fixed: 'right',
    responsive: ['xs', 'sm', 'md', 'lg'],
    render: (data: IPermission) => (
      <PermissionsTableActions permissionData={data} />
    ),
  },
]
