import UsersFormDrawer from './drawer/form'
import UserPermissionDrawer from './drawer/permissions'
import UserTenantsDrawer from './drawer/tenants'
import UsersTable from './table'

import './index.scss'
import UserCashBoxesDrawer from './drawer/cashboxes'

/**
 * UsersPage component
 *
 * This component handles the users page. It displays a table of users and includes
 * drawers for user form, user permissions, and user tenants.
 *
 * @returns {JSX.Element} The rendered component
 */
export const UsersPage: React.FC = (): JSX.Element => {
  return (
    <div className='users-container'>
      <h2 className='page-title'>Usuarios</h2>
      <UsersTable />
      <UsersFormDrawer />
      <UserPermissionDrawer />
      <UserTenantsDrawer />
      <UserCashBoxesDrawer />
    </div>
  )
}

export default UsersPage
