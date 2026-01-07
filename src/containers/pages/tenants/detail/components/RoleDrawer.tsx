import React, { useEffect, useMemo } from 'react'
import { Drawer, Form, Input, Button, Space, Switch, FloatButton } from 'antd'
import { GrUpdate } from 'react-icons/gr'
import { MdAddCircle } from 'react-icons/md'
import { IRole } from '@/interfaces'

interface RoleDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: (values: {
    name: string
    description: string
    modifiable?: boolean
    deletable?: boolean
  }) => Promise<boolean>
  onUpdate?: (
    roleUid: string,
    values: {
      name: string
      description: string
      modifiable?: boolean
      deletable?: boolean
    }
  ) => Promise<boolean>
  loading?: boolean
  role?: IRole | null
  editMode?: boolean
}

const RoleDrawer: React.FC<RoleDrawerProps> = ({
  visible,
  onClose,
  onSubmit,
  onUpdate,
  loading = false,
  role = null,
  editMode = false,
}) => {
  const [form] = Form.useForm()

  const isUpdating = useMemo(
    () => editMode && Boolean(role?.uid),
    [editMode, role?.uid]
  )
  const isDisabled = useMemo(
    () => Boolean(!role?.modifiable && isUpdating),
    [role?.modifiable, isUpdating]
  )

  const { drawerTitle, btnTooltipText } = useMemo(() => {
    if (isUpdating) {
      return { drawerTitle: 'Actualizar Rol', btnTooltipText: 'Actualizar' }
    }
    return { drawerTitle: 'Crear Rol', btnTooltipText: 'Crear' }
  }, [isUpdating])

  const handleSubmit = async (values: {
    name: string
    description: string
    modifiable?: boolean
    deletable?: boolean
  }) => {
    let success = false

    if (isUpdating && role?.uid && onUpdate) {
      success = await onUpdate(role.uid, values)
    } else {
      const roleData = {
        ...values,
        modifiable: values.modifiable !== undefined ? values.modifiable : true,
        deletable: values.deletable !== undefined ? values.deletable : true,
      }
      success = await onSubmit(roleData)
    }

    if (success) {
      form.resetFields()
      onClose()
    }
  }

  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  const handleConfirmBtn = () => {
    form.validateFields().then((values) => {
      handleSubmit(values)
    })
  }

  useEffect(() => {
    if (role && editMode) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        modifiable: role.modifiable,
        deletable: role.deletable,
      })
    } else {
      form.resetFields()
    }
  }, [role, editMode, form])

  return (
    <Drawer
      title={drawerTitle}
      width={500}
      onClose={handleClose}
      open={visible}
      destroyOnClose
      maskClosable={false}
      className='role-form-drawer'
      extra={
        <>
          {!(loading || isDisabled) && (
            <FloatButton
              style={{ position: 'relative', top: '0px', right: '0px' }}
              type='primary'
              tooltip={btnTooltipText}
              icon={isUpdating ? <GrUpdate /> : <MdAddCircle />}
              onClick={handleConfirmBtn}
              shape='square'
            />
          )}
        </>
      }
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        disabled={isDisabled}
      >
        <Form.Item
          name='name'
          label='Nombre'
          rules={[
            { required: true, message: 'Este campo es obligatorio' },
            { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
          ]}
          hasFeedback
        >
          <Input placeholder='Nombre' />
        </Form.Item>

        <Form.Item name='description' label='Descripción' hasFeedback>
          <Input.TextArea rows={4} placeholder='Descripción' />
        </Form.Item>

        <Form.Item
          name='modifiable'
          rules={[{ required: true, message: 'Este campo es obligatorio' }]}
          hasFeedback
          valuePropName='checked'
          initialValue={true}
        >
          <Switch
            unCheckedChildren='No se puede modificar'
            checkedChildren='Se puede modificar'
          />
        </Form.Item>

        <Form.Item
          name='deletable'
          hasFeedback
          valuePropName='checked'
          initialValue={true}
        >
          <Switch
            unCheckedChildren='No se puede borrar'
            checkedChildren='Se puede borrar'
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default RoleDrawer
