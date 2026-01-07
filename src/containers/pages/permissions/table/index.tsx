import { FloatButton, Table } from 'antd'
import { PermissionsTableColumns } from './config'
import { permissionsStateActions } from '@/state/permissions/actions'
import { PermissionsState } from '@/state'
import { useGetPermissionsList } from '@/hooks/usePermissions'
import { IoAddCircle } from 'react-icons/io5'
import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'

export default function PermissionsTable() {
  const { loading } = useGetPermissionsList()
  const { total, pageSize, page, pageSizeOptions, data } =
    PermissionsState.pagination.value

  return (
    <>
      <CheckAccess permission={PERMISSIONS_LIST.PermissionCreate}>
        <FloatButton
          style={{
            position: 'absolute',
            right: '37px',
            bottom: '15px',
          }}
          tooltip='Crear permiso'
          icon={<IoAddCircle />}
          type='primary'
          onClick={permissionsStateActions.addPermission}
          shape='square'
        />
      </CheckAccess>

      <CheckAccess permission={PERMISSIONS_LIST.PermissionList}>
        <Table
          size='small'
          loading={loading.value}
          dataSource={data}
          pagination={{
            position: ['bottomCenter'],
            onChange: permissionsStateActions.changePagination,
            pageSizeOptions,
            pageSize,
            current: page,
            showSizeChanger: true,
            total,
            showTotal(total, range) {
              return `${range[0]} - ${range[1]} de ${total} permisos`
            },
            responsive: true,
            size: 'default',
            locale: { items_per_page: 'por página' },
          }}
          columns={PermissionsTableColumns}
          scroll={{ y: 'calc(100dvh - 228px)' }}
          bordered
          sticky={true}
        />
      </CheckAccess>
    </>
  )
}
