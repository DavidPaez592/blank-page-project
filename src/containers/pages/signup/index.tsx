import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
} from 'antd'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { Logo } from '@/components/logo'
import { SIGNUP_FORM_FIELDS } from '@/constants'
import { confirmFieldToField } from '@/helpers'
import { useAuthSignUp } from '@/hooks/useAuth'
import { EAuthModalTypes } from '@/interfaces'
import { AuthState, ParamsState } from '@/state'
import { authStateActions } from '@/state/actions'
import SignupAuthsModal from './authsModal'

import './index.scss'

/**
 * SignUpPage component
 *
 * This component handles the sign-up page. It displays a sign-up form and handles
 * user registration. If the user is already logged in, it redirects to the previous page.
 *
 * @returns {JSX.Element} The rendered component
 */
export const SignUpPage: React.FC = (): JSX.Element => {
  const { handleSignup, isLoading } = useAuthSignUp()
  const location = useLocation()

  const [signUpForm] = Form.useForm()

  const { from } = location.state ?? { from: { pathname: '/' } }

  const acceptsTerms = Form.useWatch(
    SIGNUP_FORM_FIELDS.authTermsAndConditions.value,
    signUpForm
  )
  const acceptsPersonalData = Form.useWatch(
    SIGNUP_FORM_FIELDS.authPersonalData.value,
    signUpForm
  )

  const handleConfirmAuth = () => {
    let fieldValue = SIGNUP_FORM_FIELDS.authPersonalData.value

    if (
      AuthState.authModal.peek().type === EAuthModalTypes.TERMS_AND_CONDITIONS
    ) {
      fieldValue = SIGNUP_FORM_FIELDS.authTermsAndConditions.value
    }

    signUpForm.setFieldValue(fieldValue, true)
    authStateActions.handleCloseAuthModal()
  }

  const handleCancelAuth = () => {
    let fieldValue = SIGNUP_FORM_FIELDS.authPersonalData.value

    if (
      AuthState.authModal.peek().type === EAuthModalTypes.TERMS_AND_CONDITIONS
    ) {
      fieldValue = SIGNUP_FORM_FIELDS.authTermsAndConditions.value
    }

    signUpForm.setFieldValue(fieldValue, false)
    authStateActions.handleCloseAuthModal()
  }

  if (AuthState.isLoggedIn.value) return <Navigate replace to={from} />

  return (
    <div className='signup-page'>
      <Logo />
      <div className='signup-title'>REGISTRO DE USUARIO</div>
      <Form form={signUpForm} className='signup-form' onFinish={handleSignup}>
        <Row gutter={10} justify='space-around'>
          <Col xl={12} md={24}>
            <Form.Item
              required
              hasFeedback
              name={SIGNUP_FORM_FIELDS.identificationType.value}
              rules={[
                {
                  message: 'Por favor seleccione su tipo de identificación',
                  required: true,
                },
              ]}
            >
              <Select
                className='identification-type-input'
                placeholder={SIGNUP_FORM_FIELDS.identificationType.label}
                size='large'
                options={ParamsState.docTypes.value}
              />
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item
              required
              hasFeedback
              name={SIGNUP_FORM_FIELDS.identificationNumber.value}
              rules={[
                {
                  message: 'Por favor ingrese su identificación',
                  required: true,
                },
              ]}
            >
              <Input
                className='identification-number-input'
                placeholder={SIGNUP_FORM_FIELDS.identificationNumber.label}
                size='large'
              />
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item
              hasFeedback
              name={SIGNUP_FORM_FIELDS.firstName.value}
              required
              rules={[
                {
                  message: 'Por favor ingrese su primer nombre',
                  required: true,
                },
              ]}
            >
              <Input
                autoComplete={SIGNUP_FORM_FIELDS.firstName.value}
                className='first-name-input'
                placeholder={SIGNUP_FORM_FIELDS.firstName.label}
                size='large'
              />
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item hasFeedback name={SIGNUP_FORM_FIELDS.secondName.value}>
              <Input
                autoComplete={SIGNUP_FORM_FIELDS.secondName.value}
                className='second-name-input'
                placeholder={SIGNUP_FORM_FIELDS.secondName.label}
                size='large'
              />
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item
              hasFeedback
              name={SIGNUP_FORM_FIELDS.firstSurname.value}
              required
              rules={[
                {
                  message: 'Por favor ingrese su primer apellido',
                  required: true,
                },
              ]}
            >
              <Input
                autoComplete={SIGNUP_FORM_FIELDS.firstSurname.value}
                className='first-surname-input'
                placeholder={SIGNUP_FORM_FIELDS.firstSurname.label}
                size='large'
              />
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item
              hasFeedback
              name={SIGNUP_FORM_FIELDS.secondSurname.value}
            >
              <Input
                autoComplete={SIGNUP_FORM_FIELDS.secondSurname.value}
                className='second-surname-input'
                placeholder={SIGNUP_FORM_FIELDS.secondSurname.label}
                size='large'
              />
            </Form.Item>
          </Col>

          <Col xl={24}>
            <Form.Item hasFeedback name={SIGNUP_FORM_FIELDS.birthdate.value}>
              <DatePicker
                className='birthdate-input'
                placeholder={SIGNUP_FORM_FIELDS.birthdate.label}
                size='large'
                format='YYYY-MM-DD'
              />
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item
              hasFeedback
              name={SIGNUP_FORM_FIELDS.email.value}
              required
              rules={[
                {
                  message: 'Por favor ingrese su email',
                  required: true,
                },
                {
                  type: 'email',
                  message: 'No es un email válido',
                },
              ]}
            >
              <Input
                autoComplete={SIGNUP_FORM_FIELDS.email.value}
                className='email-input'
                placeholder={SIGNUP_FORM_FIELDS.email.label.toUpperCase()}
                size='large'
              />
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item
              hasFeedback
              name={SIGNUP_FORM_FIELDS.confirmEmail.value}
              required
              dependencies={[SIGNUP_FORM_FIELDS.email.value]}
              rules={[
                {
                  message: 'Por favor confirme su email',
                  required: true,
                },
                {
                  type: 'email',
                  message: 'No es un email válido',
                },
                ({ getFieldValue }) =>
                  confirmFieldToField(
                    getFieldValue,
                    SIGNUP_FORM_FIELDS.confirmEmail.value,
                    SIGNUP_FORM_FIELDS.email.value,
                    'Los correos no coinciden'
                  ),
              ]}
            >
              <Input
                autoComplete={SIGNUP_FORM_FIELDS.confirmEmail.value}
                className='confirm-email-input'
                placeholder={SIGNUP_FORM_FIELDS.confirmEmail.label.toUpperCase()}
                size='large'
              />
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item
              hasFeedback
              name={SIGNUP_FORM_FIELDS.password.value}
              required
              rules={[
                {
                  message: 'Por favor ingrese su contraseña',
                  required: true,
                },
              ]}
            >
              <Input.Password
                autoComplete='current-password'
                className='password-input'
                maxLength={16}
                minLength={6}
                placeholder={SIGNUP_FORM_FIELDS.password.label.toUpperCase()}
                size='large'
                visibilityToggle
              />
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item
              hasFeedback
              name={SIGNUP_FORM_FIELDS.confirmPassword.value}
              required
              rules={[
                {
                  message: 'Por favor confirme su contraseña',
                  required: true,
                },
                ({ getFieldValue }) =>
                  confirmFieldToField(
                    getFieldValue,
                    SIGNUP_FORM_FIELDS.confirmPassword.value,
                    SIGNUP_FORM_FIELDS.password.value,
                    'Las contraseñas no coinciden'
                  ),
              ]}
              dependencies={[SIGNUP_FORM_FIELDS.password.value]}
            >
              <Input.Password
                autoComplete='repeat-password'
                className='confirm-password-input'
                maxLength={16}
                minLength={6}
                placeholder={SIGNUP_FORM_FIELDS.confirmPassword.label.toUpperCase()}
                size='large'
                visibilityToggle
              />
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item
              hasFeedback
              name={SIGNUP_FORM_FIELDS.authPersonalData.value}
              required
              rules={[
                {
                  message:
                    'Es necesaria su autorización para continuar con el registro',
                  required: true,
                },
              ]}
            >
              <Checkbox
                onChange={() => {
                  authStateActions.handleSetAuthModalType(
                    EAuthModalTypes.AUTH_PERSONAL_DATA
                  )
                }}
                checked={acceptsPersonalData}
              >
                {SIGNUP_FORM_FIELDS.authPersonalData.label}
              </Checkbox>
            </Form.Item>
          </Col>

          <Col xl={12} md={24}>
            <Form.Item
              hasFeedback
              name={SIGNUP_FORM_FIELDS.authTermsAndConditions.value}
              required
              rules={[
                {
                  message:
                    'Es necesaria su autorización para continuar con el registro',
                  required: true,
                },
              ]}
            >
              <Checkbox
                onChange={() => {
                  authStateActions.handleSetAuthModalType(
                    EAuthModalTypes.TERMS_AND_CONDITIONS
                  )
                }}
                checked={acceptsTerms}
              >
                {SIGNUP_FORM_FIELDS.authTermsAndConditions.label}
              </Checkbox>
            </Form.Item>
          </Col>

          <Button
            className='submit-btn'
            htmlType='submit'
            loading={isLoading.value}
            type='primary'
            disabled={!(acceptsTerms && acceptsPersonalData) || isLoading.value}
          >
            Registrarme
          </Button>

          <div className='signin-label'>
            <Link to='/signin'>Iniciar sesión</Link>
          </div>
        </Row>
      </Form>
      <SignupAuthsModal
        handleConfirm={handleConfirmAuth}
        handleCancel={handleCancelAuth}
      />
    </div>
  )
}

export default SignUpPage
