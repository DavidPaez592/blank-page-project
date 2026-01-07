import RolesFormDrawer from './drawers/form'
import RolesPermissionDrawer from './drawers/permissions'
import RolesTable from './table'

import './index.scss'

/**
 * RolesPage component
 *
 * This component handles the roles page. It displays a table of roles and includes
 * drawers for role form and role permissions.
 *
 * @returns {JSX.Element} The rendered component
 */
export const RolesPage: React.FC = (): JSX.Element => {
  return (
    <div className='roles-container'>
      <h2 className='page-title'>Roles</h2>
      <RolesTable />
      <RolesFormDrawer />
      <RolesPermissionDrawer />
    </div>
  )
}

export default RolesPage
