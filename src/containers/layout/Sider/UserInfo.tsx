import { useComputed } from '@preact/signals-react'
import { Tooltip } from 'antd'

import { useSidebar } from '@/hooks/useSidebar'
import { AuthState } from '@/state'
import { UserGlobalMenu } from './user-menu'

/**
 * SidebarUserInfo component
 *
 * This component renders the user information section in the sidebar. It displays the user's full name
 * and current role with tooltips for additional information. It also includes a global menu for user actions.
 *
 * @returns {JSX.Element} The rendered component
 */
export const SidebarUserInfo: React.FC = (): JSX.Element => {
  const { isCollapsed } = useSidebar()

  const userData = useComputed(() => {
    const { firstName, firstSurname, roles } = AuthState.currentUser.value
    const currentRoleUId = AuthState.currentRole.value

    return {
      fullName: `${firstName} ${firstSurname}`,
      currentRole: roles?.find((item) => item.uid === currentRoleUId)?.name,
    }
  })

  return (
    <section
      className={['user-info', isCollapsed ? 'collapsed' : 'extended'].join(
        ' '
      )}
    >
      {!isCollapsed && (
        <div className='name-role'>
          <Tooltip title='Nombre del usuario' placement='top' trigger={'click'}>
            <div className='user-name'>{userData.value.fullName}</div>
          </Tooltip>

          <Tooltip title='Rol del usuario' placement='top' trigger={'click'}>
            <div className='current-role'>{userData.value.currentRole}</div>
          </Tooltip>
        </div>
      )}

      <div className='user-actions'>
        <UserGlobalMenu />
      </div>
    </section>
  )
}
