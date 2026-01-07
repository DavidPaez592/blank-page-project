import { FloatButton, Table } from 'antd'
import { IoAddCircle } from 'react-icons/io5'

import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useGetTenantsList } from '@/hooks/useTenants'
import { TenantsState } from '@/state'
import { tenantsStateActions } from '@/state/actions'
import { TenantsTableColumns } from './config'

export const TenantsTable: React.FC = (): JSX.Element => {
  const { loading } = useGetTenantsList()
  const { total, pageSize, page, pageSizeOptions, data } =
    TenantsState.pagination.value

  return (
    <>
      <CheckAccess permission={PERMISSIONS_LIST.TenantsCreate}>
        <FloatButton
          style={{
            position: 'absolute',
            right: '37px',
            bottom: '15px',
          }}
          tooltip='Crear empresa'
          icon={<IoAddCircle />}
          type='primary'
          onClick={tenantsStateActions.addTenant}
          shape='square'
        />
      </CheckAccess>

      <CheckAccess
        permission={PERMISSIONS_LIST.TenantsList}
        message='No tienes acceso a la lista de empresas'
      >
        <Table
          size='small'
          loading={loading.value}
          dataSource={data}
          pagination={{
            position: ['bottomCenter'],
            onChange: tenantsStateActions.changePagination,
            pageSizeOptions,
            pageSize,
            current: page,
            showSizeChanger: true,
            total,
            showTotal(total, range) {
              return `${range[0]} - ${range[1]} de ${total} empresas`
            },
            responsive: true,
            size: 'default',
            locale: { items_per_page: 'por página' },
          }}
          columns={TenantsTableColumns}
          scroll={{ x: 'max-content', y: 'calc(100dvh - 132px)' }}
          bordered
          sticky={true}
        />
      </CheckAccess>
    </>
  )
}

export default TenantsTable
