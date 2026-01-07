import TenantsFormDrawer from './drawer/form'
import TenantsTable from './table'

import './index.scss'

/**
 * TenantsPage component
 *
 * This component handles the tenants page. It displays a table of tenants and includes
 * a drawer for tenant form.
 *
 * @returns {JSX.Element} The rendered component
 */
export const TenantsPage: React.FC = (): JSX.Element => {
  return (
    <div className='tenants-container'>
      <h2 className='page-title'>Empresas</h2>
      <TenantsTable />
      <TenantsFormDrawer />
    </div>
  )
}

export default TenantsPage
