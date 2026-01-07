import { useComputed } from '@preact/signals-react'
import { Drawer, FloatButton, Select } from 'antd'
import { IoIosSave } from 'react-icons/io'

import { useGetUserPermissions, useUserPermissions } from '@/hooks/useUsers'
import { ParamsState, UsersState } from '@/state'
import { usersStateActions } from '@/state/actions'
import UserAssignPermissions from '../assignPermissions'

import './permissions.scss'

/**
 * UserPermissionDrawer component renders a drawer for assigning permissions to a user.
 * It includes a Select component for selecting user roles and a UserAssignPermissions component.
 *
 * @returns {JSX.Element} The rendered UserPermissionDrawer component.
 */
export const UserPermissionDrawer: React.FC = (): JSX.Element => {
  const { handleAssignPermissions, loading } = useUserPermissions()
  const { loading: loadingGet } = useGetUserPermissions()

  /**
   * Computes the full name of the current user.
   *
   * @returns {string} The full name of the current user in uppercase.
   */
  const userFullName = useComputed(() => {
    const { firstName, firstSurname } = UsersState.currentUser.value
    return `${firstName} ${firstSurname}`.toUpperCase()
  })

  /**
   * Computes the options for the user roles Select component.
   *
   * @returns {Array} The filtered roles options for the current user.
   */
  const userRolesOptions = useComputed(() => {
    return ParamsState.roles.value.filter((item) =>
      UsersState.currentUser.value.roles?.includes(item.value)
    )
  })

  return (
    <Drawer
      className='drawer-user-permissions'
      destroyOnClose
      open={UsersState.openPermissionsDrawer.value}
      title={`Asignar permisos para: ${userFullName}`}
      onClose={usersStateActions.closePermissionDrawer}
      placement='bottom'
      extra={
        <>
          <Select
            className='permissions-role-selector'
            loading={loadingGet.value}
            disabled={loadingGet.value}
            style={{
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
            dropdownStyle={{
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
            options={userRolesOptions.value}
            value={UsersState.currentPermissionsRoleUId.value}
            onChange={usersStateActions.setCurrentPermissionRoleUId}
            size='large'
          />

          {!loading.value.assign && (
            <FloatButton
              className='permissions-save-button'
              type='primary'
              tooltip={'Guardar'}
              icon={<IoIosSave />}
              onClick={handleAssignPermissions}
              shape='square'
            />
          )}
        </>
      }
    >
      <UserAssignPermissions />
    </Drawer>
  )
}

export default UserPermissionDrawer
