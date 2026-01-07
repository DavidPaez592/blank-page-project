import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import axiosInstance from '@/axios'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

const OfficeForm = ({
  office,
  onCreated,
}: {
  office?: any
  onCreated: () => void
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (office) form.setFieldsValue(office)
    else form.resetFields()
  }, [office, form])

  const handleFinish = async (values: any) => {
    setLoading(true)
    try {
      if (office && office.uid) {
        // PATCH para editar
        await axiosInstance.patch(
          '/offices',
          { officeUId: office.uid, name: values.name },
          { headers: getTenantHeaders() }
        )
        message.success('Oficina actualizada correctamente')
      } else {
        // POST para crear
        await axiosInstance.post(
          '/offices',
          { name: values.name },
          { headers: getTenantHeaders() }
        )
        message.success('Oficina creada correctamente')
      }
      onCreated()
    } catch (err) {
      message.error('Error al guardar la oficina')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      layout='vertical'
      form={form}
      onFinish={handleFinish}
      autoComplete='off'
    >
      <Form.Item
        label='Nombre'
        name='name'
        rules={[{ required: true, message: 'El nombre es obligatorio' }]}
      >
        <Input placeholder='Nombre de la oficina' />
      </Form.Item>
      {/* Puedes agregar más campos aquí según el schema */}
      <Form.Item>
        <Button type='primary' htmlType='submit' loading={loading} block>
          Guardar
        </Button>
      </Form.Item>
    </Form>
  )
}

export default OfficeForm
