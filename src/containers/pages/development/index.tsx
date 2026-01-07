import { Menu, type RadioChangeEvent, Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'

import { EPermissionType } from '@/interfaces'
import { permissionsStateActions } from '@/state/permissions/actions'
import { MenuItemsPage } from '../menuItems'
import { PermissionsContainer } from '../permissions'
import { RoutesContainer } from '../routes'

/**
 * DevelopmentPage component
 *
 * This component handles the development page. It displays a menu with options for
 * permissions, menu items, and routes. It also handles navigation between these options.
 *
 * @returns {JSX.Element} The rendered component
 */
export const DevelopmentPage: React.FC = (): JSX.Element => {
  const navigate = useNavigate()

  const handleChangeCurrentType = (event: RadioChangeEvent) => {
    permissionsStateActions.changeSelectorType(event.target.value)
  }

  const items = [
    {
      label: 'Permisos',
      key: 'permissions',
      onClick: () => {
        navigate('/permissions', { replace: true })
      },
      children: [
        {
          label: 'ACCESO A RUTAS',
          key: EPermissionType.ROUTE,
          onClick: () => navigate('/development'),
        },
        {
          label: 'VALIDACIÓN DE DATOS',
          key: EPermissionType.DATA,
          onClick: () => navigate('/development'),
        },
        {
          label: 'VALIDACIÓN VISUAL',
          key: EPermissionType.VIEW,
          onClick: () => navigate('/'),
        },
      ],
    },
    {
      label: 'Opciones de Menú',
      key: 'menu-items',
      onClick: () => {
        navigate('/menu-items')
      },
    },
    {
      label: 'Rutas',
      key: 'routes',
      onClick: () => {
        navigate('/routes')
      },
    },
  ]

  return (
    <div className='dev-container'>
      {/* <Tabs
        type='card'
        size='large'
        centered
        items={[
          {
            label: 'Permisos',
            key: 'permissions',
            children: <PermissionsContainer />,
          },
          {
            label: 'Opciones de Menú',
            key: 'menu-items',
            children: <MenuItemsContainer />,
          },
          {
            label: 'Rutas',
            key: 'routes',
            children: <RoutesContainer />,
          },
        ]}
      /> */}

      <Menu
        items={items}
        mode='horizontal'
        style={{ justifyContent: 'center' }}
      />
    </div>
  )
}

export default DevelopmentPage
