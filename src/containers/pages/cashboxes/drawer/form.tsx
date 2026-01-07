import React, { useEffect, useState } from 'react'
import axiosInstance from '@/axios'
import { BsCheckLg } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { BsFloppyFill  } from "react-icons/bs";
import {
  Drawer,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  notification,
  Modal,
  Button,
  Steps,
  Alert,
  Table,
  message
} from 'antd'

import './form.scss'

const { Title, Text } = Typography
const { Item: FormItem } = Form
const { Option } = Select
const { TextArea } = Input

interface officeInterface {
  uid: string;
  name: string;
}

interface cashBoxTypeInterface {
  uid: string;
  name: string;
}

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid, 'Content-Type': 'application/json' } : {}
}

const CashBoxesForm = ({
  data,
  onCreated,
}: {
  data?: any
  onCreated: () => void
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(true);
  const [offices, setOffices] = useState<officeInterface[]>([]);
  const [office, setOffice] = useState<string | null>(null);
  const [cashBoxesType, setCashBoxesType] = useState<cashBoxTypeInterface[]>([]);
  const [cashBoxType, setCashBoxType] = useState<string | null>(null);

  useEffect(() => {
    const tenantUid = sessionStorage.getItem('tenant_uid')

    setOffice(null)
    setCashBoxType(null)

    // Validar que tenant_uid exista
    if (!tenantUid) {
      console.log('⚠️ tenant_uid no está disponible en sessionStorage')
      setOffices([])
      setCashBoxesType([])
      return
    }

    const fetchOffices = async () => {
      try {
        const res = await axiosInstance.get(
          '/v1/offices/all', 
          { headers: getTenantHeaders() }
        )

        //console.log('✅ Respuesta de offices:', JSON.stringify(res))

        const officesData = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || []
        
        //console.log(`📌 Oficinas cargadas: ${officesData.length}`)
        setOffices(officesData)
      } catch (error: any) {
        //console.error('❌ Error consultando las oficinas:', error.response?.data || error.message)
        message.error('Error cargando oficinas')
      }
    }

    const fetchCashBoxType = async () => {
      try {
        
        const res = await axiosInstance.get(
          '/v1/cashbox-types/all', 
          { headers: getTenantHeaders() }
        )

        //console.log('✅ Respuesta de tipos de caja:', JSON.stringify(res))

        const cashBoxTypeData = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || []
        
        //console.log(`📌 Tipos de caja cargados: ${cashBoxTypeData.length}`)
        setCashBoxesType(cashBoxTypeData)
      } catch (error: any) {
        //console.error('❌ Error consultando los tipos de caja:', error.response?.data || error.message)
        message.error('Error cargando tipos de caja')
      }
    }

    // Ejecutar ambas requests en paralelo
    Promise.all([fetchOffices(), fetchCashBoxType()])
      .finally(() => {
        if (data) form.setFieldsValue({...data, officeUId: data.office.uid, cashboxTypeUId: data.cashboxType.uid})
        else form.resetFields()
      })
  }, [data, form])

  const handleFinish = async (values: any) => {
    setLoading(true)
    try {
      
      if (data && data.uid) {
        // PATCH para editar
        //console.log('Actualizando caja con datos:', { name: values.name, officeUId: values.officeUId, cashboxTypeUId: values.cashboxTypeUId, isActive: isChecked });
        await axiosInstance.patch(
          '/v1/cashboxes',
          { uid: data.uid, name: values.name, cashboxTypeUId: values.cashboxTypeUId, isActive: isChecked },
          { headers: getTenantHeaders() }
        ).then((res: any) => {
          if (res?.success === false) {
            throw new Error('Error al actualizar la caja');
          }
        }).catch((error: any) => {});
        message.success('Caja actualizada correctamente')
      } else {
        // POST para crear
        //console.log('Creando caja con datos:', { name: values.name, officeUId: values.officeUId, cashboxTypeUId: values.cashboxTypeUId, isActive: isChecked });
        await axiosInstance.post(
          '/v1/cashboxes',
          { 
            name: values.name, 
            officeUId: values.officeUId,
            cashboxTypeUId: values.cashboxTypeUId,
            isActive: isChecked
          },
          { headers: getTenantHeaders() }
        ).then((res: any) => {
          if (res?.success === false) {
            throw new Error('Error al guardar la caja');
          }
        }).catch((error: any) => {});
        message.success('Caja creada correctamente')
      }
      onCreated()
    } catch (err) {
      message.error(`${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      layout='vertical'
      form={form}
      requiredMark={true}
      size='middle'
      className='client-form'
      onFinish={handleFinish}
      preserve={true}
    >
      <div className='form-section' style={{ display: 'block'}}>
        <Title level={5} className='section-title'>
          Datos Básicos
        </Title>
        <Row gutter={[12, 0]}>
          <Col xs={24}>
            <FormItem
              label='Nombre de la Caja'
              name='name'
              rules={[{ required: true, message: 'El nombre es obligatorio' }]}
            >
              <Input placeholder='Nombre de la caja' />
            </FormItem>
          </Col>
          <Col xs={24} sm={12}>
            <FormItem
              label='Oficinas'
              name='officeUId'
              rules={[{ required: true, message: 'Debe seleccionar una obligatorio' }]}
            >
              <Select
                placeholder='Seleccione...'
                showSearch
                optionFilterProp='children'
              >
                {offices.map((type: any) => (
                  <Option key={type.uid} value={type.uid}>
                    {type.label || type.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>

          <Col xs={24} sm={12}>
            <FormItem
              label='Tipos de Caja'
              name='cashboxTypeUId'
              rules={[{ required: true, message: 'Debe seleccionar una obligatorio' }]}
            >
              <Select
                placeholder='Seleccione...'
                showSearch
                optionFilterProp='children'
              >
                {cashBoxesType.map((type: any) => (
                  <Option key={type.uid} value={type.uid}>
                    {type.label || type.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col xs={24}>
            
            <FormItem
              name='isActive'
              label='Activo'
              valuePropName='checked'
              initialValue={isChecked ? true : false}
            >
              <Switch
                checkedChildren='Sí'
                unCheckedChildren='No'
                style={{ width: 'auto' }}
                onChange={() => setIsChecked(!isChecked)}
                checked={isChecked}
              />
            </FormItem>
          </Col>
          {/* Puedes agregar más campos aquí según el schema */}
          <Col xs={24}>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={loading} block>
                <BsFloppyFill  size={16} color='white' />Guardar
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  )
}

export default CashBoxesForm
