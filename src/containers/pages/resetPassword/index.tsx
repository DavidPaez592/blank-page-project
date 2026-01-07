import { Navigate, useLocation } from 'react-router-dom'

import { useResetPwd } from '@/hooks/useAuth'
import { Logo } from '@/components/logo'
import { AuthState } from '@/state'

import { ResetPwdForm } from './form'

import './index.scss'

/**
 * ResetPasswordPage component
 *
 * This component handles the reset password page. It validates the token and
 * displays the reset password form if the token is valid. If the user is already
 * logged in, it redirects to the previous page.
 *
 * @returns {JSX.Element} The rendered component
 */
export const ResetPasswordPage: React.FC = (): JSX.Element => {
  const location = useLocation()
  const { isValidated } = useResetPwd()

  const { from } = location.state ?? { from: { pathname: '/' } }

  if (AuthState.isLoggedIn.value) return <Navigate replace to={from} />

  if (!isValidated.value)
    return (
      <div className='reset-pwd-page validating'>
        <Logo />
        <div className='token-validation'>
          Estamos realizando las validaciones necesarias para continuar con el
          proceso
        </div>
      </div>
    )

  return (
    <div className='reset-pwd-page'>
      <Logo />
      <div className='reset-pwd-title'>RESTABLECER CONTRASEÑA</div>
      <ResetPwdForm />
    </div>
  )
}

export default ResetPasswordPage
