import MenuItemsDrawer from './drawer'
import MenuItemsTable from './table'

import './index.scss'

/**
 * MenuItemsContainer component
 *
 * This component serves as a container for the menu items page. It includes a table to display the menu items
 * and a drawer for adding or editing menu items.
 *
 * @returns {JSX.Element} The rendered component
 */
export const MenuItemsPage: React.FC = (): JSX.Element => {
  return (
    <div className='menu-items-container'>
      <MenuItemsTable />
      <MenuItemsDrawer />
    </div>
  )
}

export default MenuItemsPage
