import { Navigate, Outlet } from 'react-router-dom'

import { PUBLIC_ROUTE } from '@/constants'
import { AuthState } from '@/state'

/**
 * PrivateRoute component
 *
 * This component serves as a wrapper for routes that require authentication. It checks if the user is logged in
 * by accessing the `AuthState.isLoggedIn` value. If the user is authenticated, it renders the child routes using
 * the `Outlet` component. If the user is not authenticated, it redirects to the sign-in page.
 *
 * @returns {JSX.Element} The rendered component
 */
export const PrivateRoute: React.FC = (): JSX.Element => {
  if (AuthState.isLoggedIn.value) return <Outlet />

  return <Navigate replace to={PUBLIC_ROUTE.SIGN_IN} />
}

export default PrivateRoute
