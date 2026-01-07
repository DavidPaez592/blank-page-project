import { FloatButton, Table } from 'antd'
import { IoAddCircle } from 'react-icons/io5'

import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useGetUsersList } from '@/hooks/useUsers'
import { UsersState } from '@/state'
import { usersStateActions } from '@/state/actions'
import { UsersTableColumns } from './config'

/**
 * UserTable component
 *
 * This component renders a table of users. It includes a floating button for creating new users
 * and handles pagination, loading state, and access permissions.
 *
 * @component
 * @example
 * <UserTable />
 *
 * @returns {JSX.Element} The rendered component
 */
export const UserTable: React.FC = (): JSX.Element => {
  const { loading } = useGetUsersList()
  const { total, pageSize, page, pageSizeOptions, data } =
    UsersState.pagination.value

  return (
    <>
      <CheckAccess permission={PERMISSIONS_LIST.UsersCreate}>
        <FloatButton
          style={{
            position: 'absolute',
            right: '37px',
            bottom: '15px',
          }}
          tooltip='Crear usuario'
          icon={<IoAddCircle />}
          type='primary'
          onClick={usersStateActions.addUser}
          shape='square'
        />
      </CheckAccess>

      <CheckAccess
        permission={PERMISSIONS_LIST.UsersList}
        message='No tienes acceso a la lista de usuarios'
      >
        <Table
          style={{ width: '100%' }}
          size='small'
          loading={loading.value}
          dataSource={data}
          pagination={{
            position: ['bottomCenter'],
            onChange: usersStateActions.changePagination,
            pageSizeOptions,
            pageSize,
            current: page,
            showSizeChanger: true,
            total,
            showTotal(total, range) {
              return `${range[0]} - ${range[1]} de ${total} usuarios`
            },
            responsive: true,
            size: 'default',
            locale: { items_per_page: 'por página' },
          }}
          columns={UsersTableColumns.value}
          scroll={{ x: 'max-content', y: 'calc(100dvh - 132px)' }}
          bordered
          sticky={true}
        />
      </CheckAccess>
    </>
  )
}

export default UserTable
