import { Suspense, useEffect } from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import { LazyLoad } from '@/components/suspense/LazyLoad'
import { ROUTER_BASE } from '@/constants'
import { Dashboard } from '@/containers/layout/App'
import { NotFoundPage } from '@/containers/pages/notFound'
import { PrivateRoute } from '@/containers/views/privateRouter'
import { privateRoutes, publicRoutes } from './routes'

/**
 * Router component
 *
 * This component sets up the routing for the application. It uses `BrowserRouter` for
 * client-side routing, `Suspense` for lazy loading, and `Routes` to define the route
 * structure. It includes public routes, private routes, and a fallback route for 404
 * Not Found pages.
 *
 * @param {object} props - The props passed to the component.
 * @returns {JSX.Element} The rendered component
 */
export const Router: React.FC = (props: object): JSX.Element => {
  // Redirección según cantidad de tenants en sessionStorage
  const RedirectHandler = () => {
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
      const tenantsRaw = sessionStorage.getItem('tenants')
      const tenantSelected =
        sessionStorage.getItem('tenant_selected') === 'true'
      let tenants: any[] = []
      try {
        if (tenantsRaw) tenants = JSON.parse(tenantsRaw)
      } catch {}
      // Redirige SOLO si hay más de un tenant y NO has seleccionado uno aún
      if (location.pathname === '/' && tenants.length > 1 && !tenantSelected) {
        navigate('/select-tenant', { replace: true })
      }
    }, [location, navigate])
    return null
  }

  return (
    <BrowserRouter basename={ROUTER_BASE ?? ''}>
      <RedirectHandler />
      <Suspense fallback={<LazyLoad />}>
        <Routes>
          {publicRoutes.map((route) => (
            <Route
              Component={route.component}
              key={route.path}
              path={route.path}
            />
          ))}

          <Route element={<PrivateRoute />}>
            <Route element={<Dashboard {...props} />} path='/'>
              {privateRoutes.map((route) => (
                <Route
                  Component={route.component}
                  key={route.path}
                  path={route.path}
                />
              ))}
            </Route>
          </Route>

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
