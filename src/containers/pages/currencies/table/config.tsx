import { TableColumnsType, Tag } from 'antd'

import { getView } from '@/helpers'
import { ICurrency } from '@/interfaces'
import CurrenciesTableActions from './actions.tsx'

export const CurrenciesTableColumns: TableColumnsType<ICurrency> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    ellipsis: true,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Código',
    dataIndex: 'code',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    width: 100,
    render: (code: string) => (
      <Tag color='blue' style={{ fontWeight: 'bold', fontSize: '12px' }}>
        {code}
      </Tag>
    ),
    sorter: (a, b) => a.code.localeCompare(b.code),
  },
  {
    title: 'Símbolo',
    dataIndex: 'symbol',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    width: 100,
    render: (symbol: string) => (
      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{symbol}</span>
    ),
  },
  {
    title: 'Acciones',
    align: 'center',
    key: 'actions',
    fixed: getView(window.innerWidth) === 'Desktop' ? 'right' : false,
    responsive: ['xs', 'sm', 'md', 'lg'],
    width: 120,
    render: (data: ICurrency) => <CurrenciesTableActions currencyData={data} />,
  },
]
