import { Navigate, useLocation } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { useActivateAccount } from '@/hooks/useAuth'
import { AuthState } from '@/state'

import './index.scss'

/**
 * ActivateAccountPage component
 *
 * This component handles the account activation page. It validates the activation token
 * and displays a message while the validation is in progress. If the user is already
 * logged in, it redirects to the previous page.
 *
 * @returns {JSX.Element} The rendered component
 */
export const ActivateAccountPage: React.FC = (): JSX.Element => {
  const location = useLocation()
  useActivateAccount()

  const { from } = location.state ?? { from: { pathname: '/' } }

  if (AuthState.isLoggedIn.value) return <Navigate replace to={from} />

  return (
    <div className='activate-account-page'>
      <Logo />
      <div className='token-validation'>
        Estamos realizando las validaciones necesarias para continuar con el
        proceso
      </div>
    </div>
  )
}

export default ActivateAccountPage
