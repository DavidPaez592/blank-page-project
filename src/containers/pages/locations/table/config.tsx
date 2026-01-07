import { TableColumnsType } from 'antd'

import { getView } from '@/helpers'
import { ILocation } from '@/interfaces'
import LocationTableActions from './actions'

export const LocationsTableColumns: TableColumnsType<ILocation> = [
  {
    title: 'Código',
    dataIndex: 'code',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    width: 120,
  },
  {
    title: 'Nombre',
    dataIndex: 'name',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    ellipsis: true,
  },
  {
    title: 'Dirección',
    dataIndex: 'address',
    align: 'center',
    responsive: ['sm', 'md', 'lg'],
    ellipsis: true,
  },
  {
    title: 'Ciudad',
    dataIndex: ['city', 'name'],
    align: 'center',
    responsive: ['md', 'lg'],
    render: (_, record: ILocation) => {
      return (record as any).city?.name || '-'
    },
  },
  {
    title: 'Detalles Adicionales',
    dataIndex: 'additionalDetails',
    align: 'center',
    responsive: ['lg'],
    ellipsis: true,
    render: (text) => text || '-',
  },
  {
    title: 'Acciones',
    align: 'center',
    key: 'actions',
    fixed: getView(window.innerWidth) === 'Desktop' ? 'right' : false,
    responsive: ['xs', 'sm', 'md', 'lg'],
    width: 150,
    render: (data: ILocation) => <LocationTableActions locationData={data} />,
  },
]
