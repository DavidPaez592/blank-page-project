import { TableColumnsType, Tag } from 'antd'

import { getView } from '@/helpers'
import { IExchangeRate } from '@/interfaces'
import ExchangeRatesTableActions from './actions'

export const ExchangeRatesTableColumns: TableColumnsType<IExchangeRate> = [
  {
    title: 'Moneda',
    dataIndex: 'currency',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    ellipsis: true,
    render: (currency: {
      uid: string
      name: string
      code: string
      symbol: string
    }) => (
      <div style={{ textAlign: 'center' }}>
        {currency.uid ? (
          <div>
            <div style={{ fontWeight: 'bold' }}>{currency.name}</div>
            <Tag color='blue' style={{ fontSize: '10px' }}>
              {currency.code}
            </Tag>
          </div>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )}
      </div>
    ),
  },
  {
    title: 'Método de Pago',
    dataIndex: 'paymentMethod',
    align: 'center',
    responsive: ['xs', 'sm', 'md', 'lg'],
    ellipsis: true,
    render: (paymentMethod: {
      uid: string
      name: string
      description: string
    }) => (
      <div style={{ textAlign: 'center' }}>
        {paymentMethod.uid ? (
          <Tag color='green'>{paymentMethod.name}</Tag>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )}
      </div>
    ),
  },
  {
    title: 'Precio Compra',
    dataIndex: 'purchasePrice',
    align: 'center',
    responsive: ['md', 'lg'],
    render: (purchasePrice: string) => (
      <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
        $
        {parseFloat(purchasePrice).toLocaleString('es-CO', {
          minimumFractionDigits: 2,
        })}
      </span>
    ),
    sorter: (a, b) => parseFloat(a.purchasePrice) - parseFloat(b.purchasePrice),
  },
  {
    title: 'Precio Venta',
    dataIndex: 'salePrice',
    align: 'center',
    responsive: ['md', 'lg'],
    render: (salePrice: string) => (
      <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
        $
        {parseFloat(salePrice).toLocaleString('es-CO', {
          minimumFractionDigits: 2,
        })}
      </span>
    ),
    sorter: (a, b) => parseFloat(a.salePrice) - parseFloat(b.salePrice),
  },
  {
    title: 'TRM',
    dataIndex: 'trm',
    align: 'center',
    responsive: ['lg'],
    render: (trm: string) => (
      <span style={{ fontWeight: 'bold', color: '#722ed1' }}>
        ${parseFloat(trm).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
      </span>
    ),
    sorter: (a, b) => parseFloat(a.trm) - parseFloat(b.trm),
  },
  {
    title: 'Acciones',
    align: 'center',
    key: 'actions',
    fixed: getView(window.innerWidth) === 'Desktop' ? 'right' : false,
    responsive: ['xs', 'sm', 'md', 'lg'],
    width: 120,
    render: (_, record: IExchangeRate) => (
      <ExchangeRatesTableActions exchangeRateData={record} />
    ),
  },
]
