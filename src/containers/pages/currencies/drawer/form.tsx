import React, { useEffect, useMemo, useState } from 'react'
import { Drawer, FloatButton, Form, Input, Space, Typography, Spin } from 'antd'
import { MdAddCircle } from 'react-icons/md'
import { GrUpdate } from 'react-icons/gr'
import { useCurrencies } from '@/hooks/useCurrencies'
import './form.scss'

const { Title, Text } = Typography
const { Item: FormItem } = Form

/**
 * CurrenciesFormDrawer component
 *
 * This component renders a drawer containing a form for creating or updating a currency.
 * It includes fields for currency name, code, symbol, and active status.
 *
 * @returns {JSX.Element} The rendered component
 */
export const CurrenciesFormDrawer: React.FC = (): JSX.Element => {
  const [submitting, setSubmitting] = useState(false)
  const [currencyForm] = Form.useForm()
  const {
    openDrawer,
    editMode,
    currentCurrency,
    handleCreateCurrency,
    handleUpdateCurrency,
    handleCloseDrawer,
  } = useCurrencies()

  const { drawerTitle, buttonIcon, buttonTooltip } = useMemo(() => {
    if (editMode.value) {
      return {
        drawerTitle: 'Editar Moneda',
        buttonIcon: <GrUpdate />,
        buttonTooltip: 'Actualizar Moneda',
      }
    }

    return {
      drawerTitle: 'Nueva Moneda',
      buttonIcon: <MdAddCircle />,
      buttonTooltip: 'Crear Moneda',
    }
  }, [editMode.value])

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      const values = await currencyForm.validateFields()

      if (editMode.value && currentCurrency.value.uid) {
        await handleUpdateCurrency({
          uid: currentCurrency.value.uid,
          ...values,
        })
      } else {
        await handleCreateCurrency(values)
      }
    } catch (error) {
      console.error('Form validation failed:', error)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (openDrawer.value && currentCurrency.value) {
      currencyForm.setFieldsValue({
        name: currentCurrency.value.name || '',
        code: currentCurrency.value.code || '',
        symbol: currentCurrency.value.symbol || '',
      })
    }
  }, [currentCurrency.value, openDrawer.value, currencyForm])

  useEffect(() => {
    if (!openDrawer.value) {
      currencyForm.resetFields()
    }
  }, [openDrawer.value, currencyForm])

  if (submitting) return <Spin fullscreen />

  return (
    <Drawer
      title={
        <div className='drawer-header'>
          <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
            {drawerTitle}
          </Title>
          <Text type='secondary'>
            {editMode.value
              ? 'Modifica los datos de la moneda'
              : 'Completa la información de la nueva moneda'}
          </Text>
        </div>
      }
      placement='right'
      width={500}
      onClose={handleCloseDrawer}
      open={openDrawer.value}
      className='currencies-form-drawer'
      destroyOnClose
      maskClosable={false}
    >
      <div className='drawer-content'>
        <Form
          form={currencyForm}
          layout='vertical'
          requiredMark={false}
          size='large'
          className='currency-form'
        >
          <div className='form-section'>
            <Title level={5} className='section-title'>
              Información General
            </Title>

            <FormItem
              name='name'
              label='Nombre de la Moneda'
              rules={[
                {
                  required: true,
                  message: 'El nombre de la moneda es requerido',
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
                placeholder='Ej: Dólar Estadounidense'
                showCount
                maxLength={100}
              />
            </FormItem>

            <Space.Compact style={{ width: '100%' }}>
              <FormItem
                name='code'
                label='Código de la Moneda'
                style={{ flex: 1 }}
                rules={[
                  {
                    required: true,
                    message: 'El código de la moneda es requerido',
                  },
                  {
                    len: 3,
                    message: 'El código debe tener exactamente 3 caracteres',
                  },
                  {
                    pattern: /^[A-Z]{3}$/,
                    message: 'El código debe ser 3 letras mayúsculas (ej: USD)',
                  },
                ]}
              >
                <Input
                  placeholder='USD'
                  maxLength={3}
                  style={{ textTransform: 'uppercase' }}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase()
                    currencyForm.setFieldValue('code', value)
                  }}
                />
              </FormItem>

              <FormItem
                name='symbol'
                label='Símbolo'
                style={{ flex: 1 }}
                rules={[
                  {
                    required: true,
                    message: 'El símbolo de la moneda es requerido',
                  },
                  {
                    max: 10,
                    message: 'El símbolo no puede exceder 10 caracteres',
                  },
                ]}
              >
                <Input placeholder='$' maxLength={10} />
              </FormItem>
            </Space.Compact>
          </div>
        </Form>

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

export default CurrenciesFormDrawer
