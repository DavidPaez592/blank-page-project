import { RESET_PWD_FORM_FIELDS } from '@/constants'
import { confirmFieldToField } from '@/helpers'
import { useAuth } from '@/hooks/useAuth'
import { Button, Col, Form, Input, Row } from 'antd'

export const ResetPwdForm: React.FC = () => {
  const { handleResetPwd, isLoading } = useAuth()

  return (
    <Form className='reset-pwd-form' onFinish={handleResetPwd}>
      <Row gutter={10} justify='space-around'>
        <Col xl={24}>
          <Form.Item
            hasFeedback
            name={RESET_PWD_FORM_FIELDS.password.value}
            required
            rules={[
              {
                message: 'Por favor ingrese su nueva contraseña',
                required: true,
              },
            ]}
          >
            <Input.Password
              autoComplete='current-password'
              className='password-input'
              maxLength={16}
              minLength={6}
              placeholder={RESET_PWD_FORM_FIELDS.password.label.toUpperCase()}
              size='large'
              visibilityToggle
            />
          </Form.Item>
        </Col>

        <Col xl={24}>
          <Form.Item
            hasFeedback
            name={RESET_PWD_FORM_FIELDS.confirmPassword.value}
            required
            rules={[
              {
                message: 'Por favor confirme su nueva contraseña',
                required: true,
              },
              ({ getFieldValue }) =>
                confirmFieldToField(
                  getFieldValue,
                  RESET_PWD_FORM_FIELDS.confirmPassword.value,
                  RESET_PWD_FORM_FIELDS.password.value,
                  'Las contraseñas no coinciden'
                ),
            ]}
            dependencies={[RESET_PWD_FORM_FIELDS.password.value]}
          >
            <Input.Password
              autoComplete='repeat-password'
              className='confirm-password-input'
              maxLength={16}
              minLength={6}
              placeholder={RESET_PWD_FORM_FIELDS.confirmPassword.label.toUpperCase()}
              size='large'
              visibilityToggle
            />
          </Form.Item>
        </Col>

        <Button
          className='submit-btn'
          htmlType='submit'
          loading={isLoading.value}
          disabled={isLoading.value}
          type='primary'
        >
          Reestablecer
        </Button>
      </Row>
    </Form>
  )
}
