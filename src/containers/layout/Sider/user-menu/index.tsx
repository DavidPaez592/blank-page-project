import { authStateActions } from '@/state/actions'
import { FloatButton } from 'antd'
import { LuLogOut } from 'react-icons/lu'
import { AuthState } from '@/state'
import { TbUserScan } from 'react-icons/tb'
import { CiSettings } from 'react-icons/ci'
import { TfiReload } from 'react-icons/tfi'
import { useAuth } from '@/hooks/useAuth'
import { BiSolidBuildings } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom' // <-- IMPORTA ESTO

import './user-menu.scss'

export function UserGlobalMenu() {
  const { handleChangeCurrentRole, handleReloadRole } = useAuth()
  const navigate = useNavigate() // <-- USA EL HOOK AQUÍ

  const tenantsRaw = sessionStorage.getItem('tenants')
  let tenants: any[] = []
  try {
    if (tenantsRaw) tenants = JSON.parse(tenantsRaw)
  } catch {}
  const showTenantButton = tenants.length > 1

  return (
    <FloatButton.Group
      trigger='click'
      type='primary'
      icon={<CiSettings />}
      tooltip='Menú de Usuario'
      className='user-menu'
    >
      {AuthState.roles.value
        .filter((item) => item.uid !== AuthState.currentRole.value)
        .map((item) => (
          <FloatButton
            key={item.uid}
            onClick={() => handleChangeCurrentRole(item.uid as string)}
            tooltip={`Cambiar a ${item.name}`}
            icon={<TbUserScan />}
          />
        ))}
      {}
      <FloatButton
        onClick={() => handleReloadRole()}
        tooltip='Recargar rol actual'
        icon={<TfiReload />}
      />

      {showTenantButton && (
        <FloatButton
          onClick={() => {
            sessionStorage.setItem('tenant_selected', 'false')
            navigate('/select-tenant') // <-- AQUÍ USAS navigate
          }}
          tooltip='Administrar tenants'
          icon={<BiSolidBuildings />}
        />
      )}

      <FloatButton
        onClick={authStateActions.handleLogout}
        tooltip='Cerrar sesión'
        icon={<LuLogOut />}
      />
    </FloatButton.Group>
  )
}
