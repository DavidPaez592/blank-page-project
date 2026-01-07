import PermissionsDrawer from './drawer'
import PermissionsTable from './table'
import PermissionsTypeSelector from './typeSelector'

import './index.scss'

export const PermissionsContainer: React.FC = (): JSX.Element => {
  return (
    <div className='permissions-container'>
      <h2 className='page-title'>Permisos</h2>
      <PermissionsTypeSelector />
      <PermissionsTable />
      <PermissionsDrawer />
    </div>
  )
}

export default PermissionsContainer
