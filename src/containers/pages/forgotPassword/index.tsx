import { Button, Form, Input } from 'antd'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { FORGOT_PWD_FORM_FIELDS } from '@/constants'
import { useAuth } from '@/hooks/useAuth'
import { AuthState } from '@/state'

import './index.scss'

/**
 * ForgotPasswordPage component
 *
 * This component handles the forgot password page. It displays a form for the user to
 * enter their email address to initiate the password recovery process. If the user is
 * already logged in, it redirects to the previous page.
 *
 * @returns {JSX.Element} The rendered component
 */
export const ForgotPasswordPage: React.FC = (): JSX.Element => {
  const location = useLocation()

  const { from } = location.state ?? { from: { pathname: '/' } }
  const { handleForgotPwd, isLoading } = useAuth()

  if (AuthState.isLoggedIn.value) return <Navigate replace to={from} />

  return (
    <div className='forgot-pwd-page'>
      <Logo />
      <div className='forgot-pwd-title'>RECUPERAR CONTRASEÑA</div>
      <Form className='forgot-pwd-form' onFinish={handleForgotPwd}>
        <Form.Item
          hasFeedback
          required
          name={FORGOT_PWD_FORM_FIELDS.email.value}
          rules={[
            {
              message: 'Por favor ingrese su email',
              required: true,
            },
          ]}
        >
          <Input
            autoComplete={FORGOT_PWD_FORM_FIELDS.email.value}
            className='email-input'
            placeholder={FORGOT_PWD_FORM_FIELDS.email.label}
            size='large'
          />
        </Form.Item>

        <Button
          className='submit-btn'
          htmlType='submit'
          loading={isLoading.value}
          disabled={isLoading.value}
          type='primary'
        >
          Recuperar Contraseña
        </Button>

        <div className='signin-label'>
          <Link to='/signin'>Iniciar sesión</Link>
        </div>
      </Form>
    </div>
  )
}

export default ForgotPasswordPage
