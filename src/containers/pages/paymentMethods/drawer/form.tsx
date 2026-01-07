import React, { useEffect, useMemo } from 'react'
import {
  Drawer,
  FloatButton,
  Form,
  Input,
  Space,
  Typography,
  Divider,
} from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { MdAddCircle } from 'react-icons/md'
import { GrUpdate } from 'react-icons/gr'

import { usePaymentMethods } from '@/hooks/usePaymentMethods'
import { PaymentMethodsState } from '@/state'

import './form.scss'

const { Title, Text } = Typography
const { Item: FormItem } = Form
const { TextArea } = Input

/**
 * PaymentMethodsFormDrawer component
 *
 * This component renders a drawer containing a form for creating or updating a payment method.
 * It includes fields for payment method name and description.
 *
 * @returns {JSX.Element} The rendered component
 */
export const PaymentMethodsFormDrawer: React.FC = (): JSX.Element => {
  const [paymentMethodForm] = Form.useForm()
  const {
    openDrawer,
    editMode,
    currentPaymentMethod,
    loading,
    handleCreatePaymentMethod,
    handleUpdatePaymentMethod,
    handleCloseDrawer,
  } = usePaymentMethods()

  const isLoading = loading.value.create || loading.value.update

  const { drawerTitle, buttonIcon, buttonTooltip } = useMemo(() => {
    if (editMode.value) {
      return {
        drawerTitle: 'Editar Método de Pago',
        buttonIcon: <GrUpdate />,
        buttonTooltip: 'Actualizar Método de Pago',
      }
    }

    return {
      drawerTitle: 'Nuevo Método de Pago',
      buttonIcon: <MdAddCircle />,
      buttonTooltip: 'Crear Método de Pago',
    }
  }, [editMode.value])

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await paymentMethodForm.validateFields()

      if (editMode.value && currentPaymentMethod.value.uid) {
        await handleUpdatePaymentMethod({
          uid: currentPaymentMethod.value.uid,
          ...values,
        })
      } else {
        await handleCreatePaymentMethod(values)
      }
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  // Set form values when payment method changes
  useEffect(() => {
    if (openDrawer.value && currentPaymentMethod.value) {
      paymentMethodForm.setFieldsValue({
        name: currentPaymentMethod.value.name || '',
        description: currentPaymentMethod.value.description || '',
      })
    }
  }, [currentPaymentMethod.value, openDrawer.value, paymentMethodForm])

  // Reset form when drawer closes
  useEffect(() => {
    if (!openDrawer.value) {
      paymentMethodForm.resetFields()
    }
  }, [openDrawer.value, paymentMethodForm])

  return (
    <Drawer
      title={
        <div className='drawer-header'>
          <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
            {drawerTitle}
          </Title>
          <Text type='secondary'>
            {editMode.value
              ? 'Modifica los datos del método de pago'
              : 'Completa la información del nuevo método de pago'}
          </Text>
        </div>
      }
      placement='right'
      width={500}
      onClose={handleCloseDrawer}
      open={openDrawer.value}
      className='payment-methods-form-drawer'
      destroyOnClose
      maskClosable={false}
    >
      <div className='drawer-content'>
        <Form
          form={paymentMethodForm}
          layout='vertical'
          requiredMark={false}
          size='large'
          className='payment-method-form'
        >
          <div className='form-section'>
            <Title level={5} className='section-title'>
              Información General
            </Title>

            <FormItem
              name='name'
              label='Nombre del Método de Pago'
              rules={[
                {
                  required: true,
                  message: 'El nombre del método de pago es requerido',
                },
                {
                  min: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
                {
                  max: 100,
                  message: 'El nombre no puede exceder 100 caracteres',
                },
              ]}
            >
              <Input
                placeholder='Ej: Tarjeta de Crédito'
                showCount
                maxLength={100}
              />
            </FormItem>

            <FormItem
              name='description'
              label='Descripción'
              rules={[
                {
                  max: 500,
                  message: 'La descripción no puede exceder 500 caracteres',
                },
              ]}
            >
              <TextArea
                placeholder='Descripción opcional del método de pago...'
                showCount
                maxLength={500}
                rows={4}
                style={{ resize: 'none' }}
              />
            </FormItem>
          </div>
        </Form>

        {/* Action Buttons */}
        <div className='drawer-actions'>
          <FloatButton
            icon={buttonIcon}
            type='primary'
            tooltip={buttonTooltip}
            onClick={handleSubmit}
            className='submit-button'
            style={{
              right: 24,
              bottom: 24,
            }}
          />
        </div>
      </div>
    </Drawer>
  )
}

export default PaymentMethodsFormDrawer
