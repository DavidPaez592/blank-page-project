import React, { useEffect, useState } from 'react'
import { Table, Select, Space, Pagination } from 'antd'
import axiosInstance from '@/axios'
import CashBoxesTableActions from './actions'

interface office {
  uid: string;
	name: string;
}

interface cashbox {
  uid: string;
	name: string;
}

interface cashBoxInterfice {
  name: string;
  createdAt: string;
  updatedAt: string;
  uid: string;
  isActive: boolean;
  office: office;
  cashboxType: cashbox;
}

interface CashBoxesTableProps {
  refresh: number
  onEdit?: (cashbox: cashBoxInterfice) => void
}

const CashBoxesTable: React.FC<CashBoxesTableProps> = ({ refresh, onEdit }) => {
  const [data, setData] = useState<cashBoxInterfice[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  })
  const [allMode, setAllMode] = useState(false)

  const fetchBoxes = (page = 1, pageSize = 10) => {
    setLoading(true)
    if (pageSize === -1) {
      // Modo "Todas"
      axiosInstance
        .get(
          '/v1/cashboxes/all',
          {
            headers: { 
              'x-tenant-uid': sessionStorage.getItem('tenant_uid') ,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res: any) => {
          const boxestype = Array.isArray(res?.data)
            ? res.data
            : res?.data?.data || []
          setData(boxestype)
          setPagination({
            page: 1,
            pageSize: boxestype.length,
            total: boxestype.length,
          })
          setAllMode(true)
        })
        .finally(() => setLoading(false))
    } else {
      axiosInstance
        .get('/v1/cashboxes', {
          headers: { 
            'x-tenant-uid': sessionStorage.getItem('tenant_uid'),
            'Content-Type': 'application/json',
          },
          params: { page: page, limit: pageSize },  
        })
        .then((res: any) => {
          const d = res?.data || {}
          setData(d.offices || [])
          setPagination({
            page: d.page || 1,
            pageSize: d.limit || 10,
            total: d.total || 0,
          })
          setAllMode(false)
        })
        .finally(() => setLoading(false))
    }
  }

  const fetchBoxesAll = () => {
    setLoading(true)
    axiosInstance
        .get(
          '/v1/cashboxes/all',
          {
            headers: { 
              'x-tenant-uid': sessionStorage.getItem('tenant_uid') ,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res: any) => {
          const boxestype = Array.isArray(res?.data)
            ? res.data
            : res?.data?.data || []
          setData(boxestype)
          setPagination({
            page: 1,
            pageSize: boxestype.length,
            total: boxestype.length,
          })
          setAllMode(true)
        })
        .finally(() => setLoading(false))

  }

  useEffect(() => {
    fetchBoxesAll()
    // eslint-disable-next-line
  }, [refresh])

  function formatDate(dateString: string) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
    },
    {
      title: 'Oficina',
      dataIndex: 'office',
      key: 'office.uid',
      align: 'center' as const,
      render: (office: {name:string}) => office.name
    },
    {
      title: 'Tipo de Caja',
      dataIndex: 'cashboxType',
      key: 'cashboxType.uid',
      align: 'center' as const,
      render: (cashboxType: {name:string}) => cashboxType.name
    },
    {
      title: 'Creado',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center' as const,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actualizado',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center' as const,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center' as const,
      render: (cashbox: cashBoxInterfice) => (
        <CashBoxesTableActions
          cashbox={cashbox}
          onEdit={onEdit ? () => onEdit(cashbox) : () => {}}
          onDeleted={() => fetchBoxesAll()}
        />
      ),
    },
  ]

  return (
    <>
      <Table
        size='small'
        loading={loading}
        dataSource={data}
        columns={columns}
        rowKey='uid'
        locale={{ emptyText: 'No hay cajas registrados.' }}
        scroll={{ x: 'max-content' }}
        bordered
        sticky
        pagination={false}
        footer={() => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'baseline',
              gap: 16,
              paddingRight: 8,
              paddingTop: 6,
              paddingBottom: 6,
              background: '#fafafa',
              borderRadius: '0 0 8px 8px',
              minHeight: 44,
            }}
          >
            {/* Total de cajas */}
            {!allMode && (
              <span style={{ color: '#888', fontSize: 13 }}>
                Total:&nbsp;
                <b style={{ color: '#4c4c4c', fontWeight: 500 }}>
                  {pagination.total}
                </b>
                &nbsp;Cajas
              </span>
            )}

            {/* Paginador */}
            {!allMode && (
              <Pagination
                current={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger={false}
                onChange={(page, pageSize) => fetchBoxes(page, pageSize)}
                style={{ margin: '0 8px' }}
                size='small'
              />
            )}

            {/* Select de cantidad */}
            <Select
              value={allMode ? 'all' : pagination.pageSize}
              style={{ width: 120 }}
              onChange={(val) => {
                if (val === 'all') {
                  fetchBoxes(1, -1)
                } else {
                  fetchBoxes(1, Number(val))
                }
              }}
              options={[
                { value: 10, label: '10 por página' },
                { value: 20, label: '20 por página' },
                { value: 'all', label: 'Todas' },
              ]}
              showSearch={false}
              dropdownMatchSelectWidth={false}
              size='small'
            />
          </div>
        )}
      />
    </>
  )
}

export default CashBoxesTable
