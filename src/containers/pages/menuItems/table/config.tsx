import { IMenuItem } from '@/interfaces'
import { TableColumnsType } from 'antd'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import MenuItemTableActions from './actions'
import IconComponent from '@/components/iconComponent'

export const MenuItemsTableColumns: TableColumnsType<IMenuItem> = [
  {
    title: 'Etiqueta',
    dataIndex: 'label',
    align: 'center',
    responsive: ['lg'],
  },
  {
    title: 'URL',
    dataIndex: 'url',
    align: 'center',
    responsive: ['lg'],
  },
  {
    title: 'Clave',
    dataIndex: 'key',
    align: 'center',
    ellipsis: true,
    responsive: ['lg'],
  },
  {
    title: 'Es padre',
    dataIndex: 'parent',
    align: 'center',
    responsive: ['lg'],
    render: (parent) =>
      !parent ? (
        <FaCheckCircle size={20} color='green' />
      ) : (
        <FaTimesCircle size={20} color='red' />
      ),
  },
  {
    title: 'Icono',
    dataIndex: 'icon',
    align: 'center',
    responsive: ['lg'],
    render: (icon) => <IconComponent size={20} iconName={icon} />,
  },
  {
    title: 'Acciones',
    align: 'center',
    key: 'actions',
    fixed: 'right',
    responsive: ['lg'],
    render: (data: IMenuItem) => <MenuItemTableActions menuItemData={data} />,
  },
]
