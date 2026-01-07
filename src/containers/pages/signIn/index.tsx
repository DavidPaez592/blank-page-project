import { Button, Form, Input } from 'antd'
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { SIGNIN_FORM_FIELDS } from '@/constants'
import { useAuth } from '@/hooks/useAuth'
import { AuthState } from '@/state'

import './index.scss'

/**
 * SignInPage component
 *
 * This component handles the sign-in page. It displays a sign-in form and handles
 * user authentication. If the user is already logged in, it redirects to the previous page.
 *
 * @returns {JSX.Element} The rendered component
 */
export const SignInPage: React.FC = (): JSX.Element => {
  const location = useLocation()

  const { from } = location.state ?? { from: { pathname: '/' } }
  const { handleLogin, isLoading } = useAuth()

  if (AuthState.isLoggedIn.value) return <Navigate replace to={from} />

  return (
    <div className='signin-page'>
      <Logo />
      <div className='signin-title'>INICIO DE SESIÓN</div>
      <Form className='signin-form' onFinish={handleLogin}>
        <Form.Item
          hasFeedback
          required
          name={SIGNIN_FORM_FIELDS.email.value}
          rules={[
            {
              message: 'Por favor ingrese su email',
              required: true,
            },
          ]}
        >
          <Input
            prefix={<AiOutlineMail />}
            autoComplete={SIGNIN_FORM_FIELDS.email.value}
            className='email-input'
            placeholder={SIGNIN_FORM_FIELDS.email.label}
            size='large'
          />
        </Form.Item>

        <Form.Item
          hasFeedback
          name={SIGNIN_FORM_FIELDS.password.value}
          required
          rules={[
            {
              message: 'Por favor ingrese su contraseña',
              required: true,
            },
          ]}
        >
          <Input.Password
            prefix={<AiOutlineLock />}
            autoComplete='current-password'
            className='password-input'
            maxLength={16}
            minLength={6}
            placeholder={SIGNIN_FORM_FIELDS.password.label}
            size='large'
            visibilityToggle
          />
        </Form.Item>

        <div className='signup-pwd'>
          <Link to='/signup'>Registrarme</Link>
          <Link to='/forgot-pwd'>Recuperar contraseña</Link>
        </div>

        <Button
          className='submit-btn'
          htmlType='submit'
          loading={isLoading.value}
          disabled={isLoading.value}
          type='primary'
        >
          Iniciar Sesión
        </Button>
      </Form>
    </div>
  )
}

export default SignInPage
