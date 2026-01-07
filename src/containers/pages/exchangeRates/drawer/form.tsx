import React, { useEffect, useMemo } from 'react'
import {
  Drawer,
  FloatButton,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Typography,
} from 'antd'
import { MdAddCircle } from 'react-icons/md'
import { GrUpdate } from 'react-icons/gr'
import dayjs from 'dayjs'

import { useExchangeRates } from '@/hooks/useExchangeRates'
import { useGetAllCurrencies } from '@/hooks/useCurrencies'
import { useGetAllPaymentMethods } from '@/hooks/usePaymentMethods'
import { useGetAllOffices } from '@/hooks/useOffices'

import './form.scss'

const { Title, Text } = Typography
const { Item: FormItem } = Form
const { Option } = Select

export const ExchangeRatesFormDrawer: React.FC = (): JSX.Element => {
  const [exchangeRateForm] = Form.useForm()
  const {
    openDrawer,
    editMode,
    currentExchangeRate,
    loading,
    handleCreateExchangeRate,
    handleUpdateExchangeRate,
    handleCloseDrawer,
    filters,
  } = useExchangeRates()

  const { currencyOptions } = useGetAllCurrencies()
  const { paymentMethodOptions } = useGetAllPaymentMethods()
  const { officeOptions } = useGetAllOffices()

  const isLoading = loading.value.create || loading.value.update

  const { drawerTitle, buttonIcon, buttonTooltip } = useMemo(() => {
    if (editMode.value) {
      return {
        drawerTitle: 'Editar Tasa de Cambio',
        buttonIcon: <GrUpdate />,
        buttonTooltip: 'Actualizar Tasa de Cambio',
      }
    }

    return {
      drawerTitle: 'Nueva Tasa de Cambio',
      buttonIcon: <MdAddCircle />,
      buttonTooltip: 'Crear Tasa de Cambio',
    }
  }, [editMode.value])

  const handleSubmit = async () => {
    try {
      const values = await exchangeRateForm.validateFields()

      if (editMode.value && currentExchangeRate.value.uid) {
        const updateData = {
          uid: currentExchangeRate.value.uid,
          purchasePrice: values.purchasePrice
            ? values.purchasePrice.toString()
            : undefined,
          salePrice: values.salePrice ? values.salePrice.toString() : undefined,
          trm: values.trm ? values.trm.toString() : undefined,
          date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
        }
        await handleUpdateExchangeRate(updateData)
      } else {
        const createData = {
          officeUId: values.officeUId,
          currencyUId: values.currencyUId,
          paymentMethodUId: values.paymentMethodUId,
          purchasePrice: values.purchasePrice
            ? values.purchasePrice.toString()
            : '0',
          salePrice: values.salePrice ? values.salePrice.toString() : '0',
          trm: values.trm ? values.trm.toString() : '0',
          date: values.date
            ? values.date.format('YYYY-MM-DD')
            : new Date().toISOString().split('T')[0],
        }
        await handleCreateExchangeRate(createData)
      }
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  useEffect(() => {
    if (openDrawer.value) {
      if (editMode.value && currentExchangeRate.value) {
        exchangeRateForm.setFieldsValue({
          purchasePrice: currentExchangeRate.value.purchasePrice
            ? parseFloat(currentExchangeRate.value.purchasePrice)
            : 0,
          salePrice: currentExchangeRate.value.salePrice
            ? parseFloat(currentExchangeRate.value.salePrice)
            : 0,
          trm: currentExchangeRate.value.trm
            ? parseFloat(currentExchangeRate.value.trm)
            : 0,
          date: currentExchangeRate.value.date
            ? dayjs(currentExchangeRate.value.date)
            : dayjs(),
        })
      } else {
        exchangeRateForm.setFieldsValue({
          officeUId: filters.value.officeUId || '',
          currencyUId: '',
          paymentMethodUId: '',
          purchasePrice: 0,
          salePrice: 0,
          trm: 0,
          date: dayjs(),
        })
      }
    } else {
      exchangeRateForm.resetFields()
    }
  }, [
    currentExchangeRate.value,
    openDrawer.value,
    editMode.value,
    filters.value.officeUId,
    exchangeRateForm,
  ])

  useEffect(() => {
    if (!openDrawer.value) {
      exchangeRateForm.resetFields()
    }
  }, [openDrawer.value, exchangeRateForm])
  return (
    <Drawer
      title={
        <div className='drawer-header'>
          <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
            {drawerTitle}
          </Title>
          <Text type='secondary'>
            {editMode.value
              ? 'Modifica los datos de la tasa de cambio'
              : 'Completa la información de la nueva tasa de cambio'}
          </Text>
        </div>
      }
      placement='right'
      width={500}
      onClose={handleCloseDrawer}
      open={openDrawer.value}
      className='exchange-rates-form-drawer'
      destroyOnClose
      maskClosable={false}
    >
      <div className='drawer-content'>
        <Form
          form={exchangeRateForm}
          layout='vertical'
          requiredMark={false}
          size='large'
          className='exchange-rate-form'
        >
          <div className='form-section'>
            <FormItem
              name='officeUId'
              label='Oficina'
              rules={[{ required: true, message: 'La oficina es requerida' }]}
            >
              <Select
                placeholder='Se toma automáticamente del filtro de la tabla'
                disabled={editMode.value}
                options={officeOptions.value}
              />
            </FormItem>

            <FormItem
              name='currencyUId'
              label='Moneda'
              rules={[{ required: true, message: 'La moneda es requerida' }]}
            >
              <Select
                placeholder='Selecciona la moneda'
                showSearch
                optionFilterProp='children'
                disabled={editMode.value}
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    ?.indexOf(input.toLowerCase()) >= 0
                }
              >
                {currencyOptions.value?.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </FormItem>

            <FormItem
              name='paymentMethodUId'
              label='Método de Pago'
              rules={[
                { required: true, message: 'El método de pago es requerido' },
              ]}
            >
              <Select
                placeholder='Selecciona el método de pago'
                showSearch
                optionFilterProp='children'
                disabled={editMode.value}
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    ?.indexOf(input.toLowerCase()) >= 0
                }
              >
                {paymentMethodOptions.value?.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </FormItem>

            <FormItem
              name='purchasePrice'
              label='Precio de Compra'
              rules={[
                { required: true, message: 'El precio de compra es requerido' },
                {
                  type: 'number',
                  min: 0.01,
                  message: 'El precio debe ser mayor a 0',
                },
              ]}
            >
              <InputNumber
                placeholder='Ej: 4095.50'
                style={{ width: '100%' }}
                precision={2}
                min={0.01}
                max={9999999.99}
                step={0.01}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) =>
                  parseFloat(value!.replace(/\$\s?|(,*)/g, '')) as any
                }
              />
            </FormItem>

            <FormItem
              name='salePrice'
              label='Precio de Venta'
              rules={[
                { required: true, message: 'El precio de venta es requerido' },
                {
                  type: 'number',
                  min: 0.01,
                  message: 'El precio debe ser mayor a 0',
                },
              ]}
            >
              <InputNumber
                placeholder='Ej: 4105.75'
                style={{ width: '100%' }}
                precision={2}
                min={0.01}
                max={9999999.99}
                step={0.01}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) =>
                  parseFloat(value!.replace(/\$\s?|(,*)/g, '')) as any
                }
              />
            </FormItem>

            <FormItem
              name='trm'
              label='TRM (Tasa Representativa del Mercado)'
              rules={[
                { required: true, message: 'La TRM es requerida' },
                {
                  type: 'number',
                  min: 0.01,
                  message: 'La TRM debe ser mayor a 0',
                },
              ]}
            >
              <InputNumber
                placeholder='Ej: 4100.00'
                style={{ width: '100%' }}
                precision={2}
                min={0.01}
                max={9999999.99}
                step={0.01}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) =>
                  parseFloat(value!.replace(/\$\s?|(,*)/g, '')) as any
                }
              />
            </FormItem>

            <FormItem
              name='date'
              label='Fecha de la Tasa de Cambio'
              rules={[{ required: true, message: 'La fecha es requerida' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder='Selecciona la fecha'
                format='YYYY-MM-DD'
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

export default ExchangeRatesFormDrawer
