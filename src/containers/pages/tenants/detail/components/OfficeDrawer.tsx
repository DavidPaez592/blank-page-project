import { useState } from 'react'
import { Drawer, Form, Input, FloatButton, message } from 'antd'
import { MdAddCircle } from 'react-icons/md'
import tenantsRequests from '@/state/tenants/requests'

interface OfficeDrawerProps {
  visible: boolean
  onClose: () => void
  tenantUId: string
  onCreated?: (office: { uid: string; name: string }) => void
  editMode?: boolean
  office?: { uid: string; name: string }
  onUpdated?: (office: { uid: string; name: string }) => void
}

const OfficeDrawer = ({
  visible,
  onClose,
  tenantUId,
  onCreated,
  editMode = false,
  office,
  onUpdated,
}: OfficeDrawerProps) => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: { name: string }) => {
    setSubmitting(true)
    try {
      if (editMode && office?.uid) {
        const response = await tenantsRequests.updateOffice({
          tenantUId,
          officeUId: office.uid,
          name: values.name.trim(),
        })
        message.success('Oficina actualizada')
        // eslint-disable-next-line no-console
        console.log('[Oficina actualizada]', response.data.office)
        onUpdated && onUpdated(response.data.office)
      } else {
        const response = await tenantsRequests.createOffice({
          tenantUId,
          name: values.name.trim(),
        })
        message.success('Oficina creada correctamente')
        // eslint-disable-next-line no-console
        console.log('[Oficina creada]', response.data)
        if (onCreated) onCreated(response.data)
      }
      form.resetFields()
      onClose()
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error creando oficina', error)
      message.error(
        error?.response?.data?.message ||
          (editMode
            ? 'No se pudo actualizar la oficina'
            : 'No se pudo crear la oficina')
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirm = () => {
    form
      .validateFields()
      .then((values) => handleSubmit(values))
      .catch(() => {})
  }

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  return visible ? (
    <Drawer
      title={editMode ? 'Editar Oficina' : 'Crear Oficina'}
      width={400}
      open={visible}
      onClose={handleClose}
      destroyOnClose
      maskClosable={false}
      extra={
        <FloatButton
          style={{ position: 'relative', top: '0px', right: '0px' }}
          type='primary'
          tooltip={editMode ? 'Guardar cambios' : 'Crear Oficina'}
          icon={<MdAddCircle />}
          onClick={handleConfirm}
          shape='square'
        />
      }
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item
          name='name'
          label='Nombre de la oficina'
          rules={[
            { required: true, message: 'El nombre es obligatorio' },
            { max: 128, message: 'Máximo 128 caracteres' },
            {
              validator: (_, value) => {
                if (value && !value.trim()) {
                  return Promise.reject('No puede ser sólo espacios')
                }
                return Promise.resolve()
              },
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder='Ej: Oficina Principal'
            disabled={submitting}
            defaultValue={office?.name}
          />
        </Form.Item>
      </Form>
    </Drawer>
  ) : null
}

export default OfficeDrawer
