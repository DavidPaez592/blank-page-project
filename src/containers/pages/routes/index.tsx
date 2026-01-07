import RoutesDrawer from './drawer'
import RoutesTable from './table'

import './index.scss'

/**
 * RoutesContainer component
 *
 * This component handles the routes container. It displays a table of routes and includes
 * a drawer for route details.
 *
 * @returns {JSX.Element} The rendered component
 */
export const RoutesContainer: React.FC = (): JSX.Element => {
  return (
    <div className='routes-container'>
      <RoutesTable />
      <RoutesDrawer />
    </div>
  )
}

export default RoutesContainer
