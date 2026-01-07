import { Table, Button, Spin, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CheckCircleOutlined } from '@ant-design/icons'
import { TransfersAndProvisionsContext } from '@/hooks/useTransfers&Provisions'

const PendingProvisionsList = ({
  pendingProvisions,
  loadingPendingProvisions,
  errorPendingProvisions,
  approbeProvision,
  approvingProvision,
}: TransfersAndProvisionsContext) => {
  if (
    (loadingPendingProvisions && pendingProvisions.length === 0) ||
    approvingProvision
  )
    return <Spin fullscreen />

  if (errorPendingProvisions)
    return <div>Error cargando provisiones pendientes</div>

  const columns: ColumnsType<any> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_value, _record, index) => index + 1,
    },
    {
      title: 'Tipo',
      dataIndex: 'operationType',
      key: 'operationType',
      render: (v) => (v === 'provision' ? 'Provisión' : v),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color =
          status === 'pending'
            ? 'orange'
            : status === 'completed'
              ? 'green'
              : 'red'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      },
    },
    {
      title: 'Observaciones',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Caja Origen',
      dataIndex: 'sourceCashboxUid',
      key: 'sourceCashboxUid',
    },
    {
      title: 'Caja Destino',
      dataIndex: 'targetCashboxUid',
      key: 'targetCashboxUid',
    },
    {
      title: 'Cantidad',
      dataIndex: 'totalAmountLocalCurrency',
      key: 'totalAmountLocalCurrency',
      align: 'right',
      render: (v) => Number(v).toLocaleString(),
    },
    {
      title: 'Moneda',
      key: 'currency',
      render: (_, record) => {
        const currency = record.currencyMovements?.[0]?.currency
        if (!currency) return '-'
        return `${currency.name} (${currency.code})`
      },
    },
    {
      title: 'Completar',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Button
          type='primary'
          size='small'
          icon={<CheckCircleOutlined />}
          onClick={() => approbeProvision(record.uid)}
          style={{ backgroundColor: '#f97316' }}
        >
          Completar
        </Button>
      ),
    },
  ]

  return (
    <Table
      rowKey='uid'
      columns={columns}
      dataSource={pendingProvisions}
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
    />
  )
}

export default PendingProvisionsList
