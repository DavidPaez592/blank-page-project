import { Drawer, FloatButton } from 'antd'
import { IoIosSave } from 'react-icons/io'

import { useRolePermissions } from '@/hooks/useRoles'
import { RolesState } from '@/state'
import { rolesStateActions } from '@/state/actions'
import RoleAssignPermissions from '../assignPermissions'

import './permissions.scss'

/**
 * RolesPermissionDrawer component
 *
 * This component handles the drawer for assigning permissions to roles. It includes a floating button for saving
 * the assigned permissions and handles the loading state.
 *
 * @returns {JSX.Element} The rendered component
 */
export const RolesPermissionDrawer: React.FC = (): JSX.Element => {
  const { handleAssignPermissions, loading } = useRolePermissions()

  return (
    <Drawer
      className='role-permissions-drawer'
      destroyOnClose
      open={RolesState.openPermissionsDrawer.value}
      title={`Asignar permisos al rol: ${RolesState.currentRole.value.name} `}
      onClose={rolesStateActions.toggleOpenPermissionDrawer}
      placement='bottom'
      extra={
        <>
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
      <RoleAssignPermissions />
    </Drawer>
  )
}

export default RolesPermissionDrawer
