import { FloatButton, Table } from 'antd'
import { IoAddCircle } from 'react-icons/io5'

import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useApp } from '@/hooks/useApp'
import { useGetRolesList } from '@/hooks/useRoles'
import { RolesState } from '@/state'
import { rolesStateActions } from '@/state/actions'
import { RolesTableColumns } from './config'

/**
 * RoleTable component
 *
 * This component displays a table of roles. It includes a floating button for creating new roles
 * and handles pagination, loading state, and access permissions.
 *
 * @returns {JSX.Element} The rendered component
 */
export const RoleTable: React.FC = (): JSX.Element => {
  const { loading } = useGetRolesList()
  const { total, pageSize, page, pageSizeOptions, data } =
    RolesState.pagination.value
  const { view } = useApp()

  return (
    <>
      <CheckAccess permission={PERMISSIONS_LIST.RolesCreate}>
        <FloatButton
          style={{
            position: 'absolute',
            right: '37px',
            bottom: '15px',
          }}
          tooltip='Crear rol'
          icon={<IoAddCircle />}
          type='primary'
          onClick={rolesStateActions.addRole}
          shape='square'
        />
      </CheckAccess>

      <CheckAccess
        permission={PERMISSIONS_LIST.RolesList}
        message='No tienes acceso a la lista de roles'
      >
        <Table
          size='small'
          loading={loading.value}
          dataSource={data}
          pagination={{
            position: ['bottomCenter'],
            onChange: rolesStateActions.changePagination,
            pageSizeOptions,
            pageSize,
            current: page,
            showSizeChanger: true,
            total,
            showTotal(total, range) {
              return `${range[0]} - ${range[1]} de ${total} roles`
            },
            responsive: true,
            size: 'default',
            locale: { items_per_page: 'por página' },
          }}
          columns={RolesTableColumns}
          scroll={{ x: 'max-content', y: 'calc(100dvh - 132px)' }}
          bordered
          sticky={true}
        />
      </CheckAccess>
    </>
  )
}

export default RoleTable
