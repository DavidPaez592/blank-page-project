import { useState, useEffect } from 'react'
import { Drawer, Form, Input, Select, FloatButton, message } from 'antd'
import { MdAddBusiness } from 'react-icons/md'
import tenantsRequests from '@/state/tenants/requests'
import { IUser } from '@/interfaces'

type DrawerMode = 'assign' | 'remove'

interface OfficeAssignUserDrawerProps {
  visible: boolean
  onClose: () => void
  tenantUId: string
  tenantName?: string
  office: { uid: string; name: string } | null
  users: IUser[]
  onAssigned?: (payload: { userUId: string; officeUId: string }) => void
  onRemoved?: (payload: { userUId: string; officeUId: string }) => void
  mode?: DrawerMode
}

const OfficeAssignUserDrawer = ({
  visible,
  onClose,
  tenantUId,
  tenantName,
  office,
  users,
  onAssigned,
  onRemoved,
  mode = 'assign',
}: OfficeAssignUserDrawerProps) => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (visible) {
      form.resetFields()
    }
  }, [visible])

  const handleSubmit = async (values: { userUId: string }) => {
    if (!office) return
    setSubmitting(true)
    try {
      const payload = {
        tenantUId,
        userUId: values.userUId,
        officeUId: office.uid,
      }
      if (mode === 'assign') {
        const resp = await tenantsRequests.assignUserToOffice(payload)
        message.success(resp.data?.message || 'Usuario asignado a la oficina')
        // eslint-disable-next-line no-console
        console.log('[Usuario asignado a oficina]', payload)
        onAssigned &&
          onAssigned({ userUId: values.userUId, officeUId: office.uid })
      } else {
        const resp = await tenantsRequests.removeUserFromOffice(payload)
        message.success(resp.data?.message || 'Usuario removido de la oficina')
        // eslint-disable-next-line no-console
        console.log('[Usuario removido de oficina]', payload)
        onRemoved &&
          onRemoved({ userUId: values.userUId, officeUId: office.uid })
      }
      form.resetFields()
      onClose()
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('Error en operación usuario-oficina', e)
      message.error(
        e?.response?.data?.message ||
          (mode === 'assign'
            ? 'No se pudo asignar el usuario'
            : 'No se pudo remover el usuario')
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirm = () => {
    form
      .validateFields()
      .then(handleSubmit)
      .catch(() => {})
  }

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const userOptions = users.map((u) => ({
    label:
      `${u.firstName || ''} ${u.firstSurname || ''}`.trim() || u.email || u.uid,
    value: u.uid!,
  }))

  return visible ? (
    <Drawer
      title={
        mode === 'assign'
          ? 'Asignar Usuario a Oficina'
          : 'Remover Usuario de Oficina'
      }
      width={420}
      open={visible}
      onClose={handleClose}
      destroyOnClose
      maskClosable={false}
      extra={
        <FloatButton
          style={{ position: 'relative', top: 0, right: 0 }}
          type='primary'
          tooltip={mode === 'assign' ? 'Asignar' : 'Remover'}
          icon={<MdAddBusiness />}
          onClick={handleConfirm}
          shape='square'
        />
      }
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        disabled={!office}
      >
        <Form.Item label='Empresa'>
          <Input value={tenantName || tenantUId} disabled />
        </Form.Item>
        <Form.Item label='Oficina'>
          <Input value={office ? office.name : ''} disabled />
        </Form.Item>
        <Form.Item
          name='userUId'
          label='Usuario'
          rules={[{ required: true, message: 'Selecciona un usuario' }]}
          hasFeedback
        >
          <Select
            placeholder='Selecciona un usuario'
            options={userOptions}
            showSearch
            optionFilterProp='label'
            disabled={submitting || userOptions.length === 0}
          />
        </Form.Item>
      </Form>
    </Drawer>
  ) : null
}

export default OfficeAssignUserDrawer
