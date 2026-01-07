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

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid, 'Content-Type': 'application/json', } : {}
}

const CashBoxTypeForm = ({
  data,
  onCreated,
}: {
  data?: any
  onCreated: () => void
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(true);
  
  useEffect(() => {
    if (data) form.setFieldsValue(data)
    else form.resetFields()
  }, [data, form])

  const handleCheckboxChange = (event:any) => {
    setIsChecked(event.target.checked);
  };

  const handleFinish = async (values: any) => {
    setLoading(true)
    try {
      
      if (data && data.uid) {
        // PATCH para editar
        await axiosInstance.patch(
          '/v1/cashbox-types',
          { uid: data.uid, name: values.name, description: values.description, isActive: isChecked },
          { headers: getTenantHeaders() }
        ).then((res: any) => {
          if (res?.success === false) {
            throw new Error('Error al actualizar el tipo de caja');
          }
        }).catch((error: any) => {}); 
        message.success('Tipo de Caja actualizado correctamente')
      } else {
        // POST para crear
        await axiosInstance.post(
          '/v1/cashbox-types',
          { name: values.name, description: values.description, isActive: isChecked },
          { headers: getTenantHeaders() }
        ).then((res: any) => {
          if (res?.success === false) {
            throw new Error('Error al guardar el tipo de caja');
          }
        }).catch((error: any) => {});
        message.success('Tipo de Caja creado correctamente')
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
          label='Nombre'
          name='name'
          rules={[{ required: true, message: 'El nombre es obligatorio' }]}
        >
          <Input placeholder='Nombre del tipo de caja' />
        </FormItem>
        </Col>
        <Col xs={24}>
        <FormItem
          label='Descripción'
          name='description'
          rules={[{ required: true, message: 'La descripción es obligatoria' }]}
        >
          <Input placeholder='Descripción del tipo de caja' />
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
        <FormItem>
          <Button type='primary' htmlType='submit' loading={loading} block>
            <BsFloppyFill  size={16} color='white' />Guardar
          </Button>
        </FormItem>
        </Col>
        </Row>
      </div>
    </Form>
  )
}

export default CashBoxTypeForm
