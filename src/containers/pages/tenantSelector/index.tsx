import { Card, message, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { authStateActions } from '@/state/auth/actions'
import './index.scss'
import microsoftLogo from '../../../assets/images/Microsoft_logo.png'
import { useState } from 'react'

type Tenant = { uid: string; name: string }

function readTenantsFromSession(): Tenant[] {
  try {
    const raw = sessionStorage.getItem('tenants')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
          .filter(
            (t) => t && typeof t.uid === 'string' && typeof t.name === 'string'
          )
          .map((t) => ({ uid: t.uid, name: t.name }))
      }
    }
  } catch {}
  return []
}

export const TenantSelectorPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const tenants = readTenantsFromSession()
  const navigate = useNavigate()

  const handleTenantSelect = async (tenantUid: string, tenantName: string) => {
    if (loading) return

    try {
      setLoading(true)

      console.log('Paso 1: Tenant seleccionado:', {
        uid: tenantUid,
        name: tenantName,
      })

      sessionStorage.setItem('tenant_uid', tenantUid)
      sessionStorage.setItem('tenant_name', tenantName)
      sessionStorage.setItem('tenant_selected', 'true')

      console.log(
        'Paso 2: tenant_uid, tenant_name y tenant_selected guardados en sessionStorage'
      )

      await authStateActions.getMe()
      console.log('Paso 3: getMe cargado')

      await authStateActions.getMenu()
      console.log('Paso 4: getMenu cargado')

      await authStateActions.getPermissions()
      console.log('Paso 5: getPermissions cargado')

      message.success('Tenant seleccionado correctamente')

      setTimeout(() => {
        console.log('Paso 6: navegando a "/"')
        navigate('/', { replace: true })
      }, 0)
    } catch (error) {
      console.error('Error seleccionando tenant:', error)
      message.error('No se pudo cargar el tenant')
    } finally {
      setLoading(false)
    }
  }

  if (tenants.length > 1) {
    return (
      <section className='tenant-selector__overlay'>
        <div className='tenant-selector__container'>
          <h1 className='tenant-selector__title'>Bienvenido al multitenant</h1>
          <p className='tenant-selector__subtitle'>
            Elige el tenant a administrar
          </p>
          <div className='tenant-selector__grid'>
            {tenants.map((tenant) => (
              <Spin key={tenant.uid} spinning={loading}>
                <Card
                  className='tenant-selector__card'
                  bordered={false}
                  size='small'
                  onClick={() => handleTenantSelect(tenant.uid, tenant.name)}
                  style={{
                    pointerEvents: loading ? 'none' : 'auto',
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                >
                  <div className='tenant-selector__card-content'>
                    <img
                      src={microsoftLogo}
                      alt='logo'
                      className='tenant-selector__logo'
                    />
                    <div className='tenant-selector__name'>{tenant.name}</div>
                    <div className='tenant-selector__uid'>
                      UID:{' '}
                      <span className='tenant-selector__uid-value'>
                        ••••••{tenant.uid.slice(-4)}
                      </span>
                    </div>
                  </div>
                </Card>
              </Spin>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (tenants.length === 1) {
    sessionStorage.setItem('tenant_uid', tenants[0].uid)
    sessionStorage.setItem('tenant_name', tenants[0].name)
    setTimeout(() => {
      navigate('/', { replace: true })
    }, 0)
    return null
  }

  return null
}

export default TenantSelectorPage
