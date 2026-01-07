import React, { useEffect } from 'react'
import {
  Drawer,
  Form,
  Select,
  message,
  Spin,
  Input,
  Row,
  Col,
  FloatButton,
  Switch,
  Typography,
} from 'antd'
import { useSignal } from '@preact/signals-react'
import { MdAddCircle, MdSave } from 'react-icons/md'
import { IRole, IUser, ETenantUserStatus } from '@/interfaces'
import { USER_FORM_FIELDS } from '@/constants'
import { ParamsState } from '@/state'
import appRequests from '@/state/requests'

const { Option } = Select
const { Text } = Typography

interface UserDrawerProps {
  visible: boolean
  onClose: () => void
  onSubmit: (userData: any) => Promise<boolean>
  loading?: boolean
  editMode?: boolean
  user?: IUser | null
  tenantUid?: string
  tenantRoles?: IRole[]
  onEdit?: (
    userUid: string,
    status: ETenantUserStatus,
    roleUid?: string,
    userData?: {
      firstName?: string
      firstSurname?: string
      secondName?: string
      secondSurname?: string
      email?: string
    },
    roleUids?: string[]
  ) => Promise<boolean>
}

export const UserDrawer: React.FC<UserDrawerProps> = ({
  visible,
  onClose,
  onSubmit,
  loading = false,
  editMode = false,
  user = null,
  tenantUid,
  tenantRoles = [],
  onEdit,
}) => {
  const [form] = Form.useForm()
  const availableRoles = useSignal<IRole[]>([])
  const loadingData = useSignal(false)

  useEffect(() => {
    if (visible) {
      loadRoles()
      if (editMode && user && tenantUid) {
        const currentTenantRelation = user.tenants?.find(
          (tenant) => tenant.uid === tenantUid
        )

        let userRoleUids: string[] = []
        if (user.roles && Array.isArray(user.roles)) {
          userRoleUids = user.roles
            .map((role) => (typeof role === 'string' ? role : role.uid))
            .filter(Boolean) as string[]
        } else if (user.currentRole?.uid) {
          userRoleUids = [user.currentRole.uid]
        }

        form.setFieldsValue({
          firstName: user.firstName,
          secondName: user.secondName,
          firstSurname: user.firstSurname,
          secondSurname: user.secondSurname,
          email: user.email,
          identificationTypeUId: user.identificationTypeUId,
          identificationNumber: user.identificationNumber,
          roleUids: userRoleUids,
          status: currentTenantRelation?.status === ETenantUserStatus.ENABLED,
        })
      } else {
        form.resetFields()
      }
    }
  }, [visible, editMode, user, tenantUid])

  const loadRoles = async () => {
    loadingData.value = true
    try {
      // Solo cargar tipos de documento ya que los roles vienen como prop
      await appRequests.Params.paramsIdTypes().then((response) => {
        ParamsState.docTypes.value = response.data.map((item: any) => ({
          label: item.label,
          value: item.uid,
        }))
      })
    } catch (error) {
      console.error('Error loading data:', error)
      message.error('Error al cargar la información')
    } finally {
      loadingData.value = false
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      if (editMode && user?.uid && onEdit) {
        const status = values.status
          ? ETenantUserStatus.ENABLED
          : ETenantUserStatus.DISABLED
        const userData = {
          firstName: values.firstName,
          firstSurname: values.firstSurname,
          secondName: values.secondName,
          secondSurname: values.secondSurname,
          email: values.email,
        }
        const firstRoleUid =
          values.roleUids && values.roleUids.length > 0
            ? values.roleUids[0]
            : undefined
        const success = await onEdit(
          user.uid,
          status,
          firstRoleUid,
          userData,
          values.roleUids
        )

        if (success) {
          form.resetFields()
          onClose()
        }
      } else {
        // Modo creación
        const userData = {
          firstName: values.firstName,
          firstSurname: values.firstSurname,
          secondName: values.secondName,
          secondSurname: values.secondSurname,
          email: values.email,
          identificationTypeUId: values.identificationTypeUId,
          identificationNumber: values.identificationNumber,
          roleUids: values.roleUids, // Enviar array de roles
        }

        const success = await onSubmit(userData)

        if (success) {
          form.resetFields()
          onClose()
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Drawer
      title={
        editMode
          ? 'Editar Usuario en la Empresa'
          : 'Crear Nuevo Usuario para la Empresa'
      }
      open={visible}
      onClose={handleCancel}
      width={600}
      destroyOnHidden
      className='user-form-drawer'
      maskClosable={false}
      extra={
        <>
          {!loading && (
            <FloatButton
              style={{ position: 'relative', top: '0px', right: '0px' }}
              type='primary'
              tooltip={editMode ? 'Actualizar Usuario' : 'Crear Usuario'}
              icon={editMode ? <MdSave /> : <MdAddCircle />}
              onClick={() => form.submit()}
              shape='square'
            />
          )}
        </>
      }
    >
      <Spin spinning={loadingData.value}>
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={USER_FORM_FIELDS.firstName.value}
                label={USER_FORM_FIELDS.firstName.label}
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese el primer nombre',
                  },
                ]}
              >
                <Input
                  placeholder={USER_FORM_FIELDS.firstName.label}
                  size='large'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={USER_FORM_FIELDS.secondName.value}
                label={USER_FORM_FIELDS.secondName.label}
              >
                <Input
                  placeholder={USER_FORM_FIELDS.secondName.label}
                  size='large'
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={USER_FORM_FIELDS.firstSurname.value}
                label={USER_FORM_FIELDS.firstSurname.label}
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese el primer apellido',
                  },
                ]}
              >
                <Input
                  placeholder={USER_FORM_FIELDS.firstSurname.label}
                  size='large'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={USER_FORM_FIELDS.secondSurname.value}
                label={USER_FORM_FIELDS.secondSurname.label}
              >
                <Input
                  placeholder={USER_FORM_FIELDS.secondSurname.label}
                  size='large'
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={USER_FORM_FIELDS.email.value}
            label={USER_FORM_FIELDS.email.label}
            rules={[
              { required: true, message: 'Por favor ingrese el email' },
              { type: 'email', message: 'Por favor ingrese un email válido' },
            ]}
          >
            <Input placeholder={USER_FORM_FIELDS.email.label} size='large' />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={USER_FORM_FIELDS.identificationType.value}
                label={USER_FORM_FIELDS.identificationType.label}
                rules={[
                  {
                    required: true,
                    message: 'Por favor seleccione el tipo de identificación',
                  },
                ]}
              >
                <Select
                  placeholder={USER_FORM_FIELDS.identificationType.label}
                  size='large'
                  options={ParamsState.docTypes.value}
                  disabled={editMode}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={USER_FORM_FIELDS.identificationNumber.value}
                label={USER_FORM_FIELDS.identificationNumber.label}
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese el número de identificación',
                  },
                ]}
              >
                <Input
                  placeholder={USER_FORM_FIELDS.identificationNumber.label}
                  size='large'
                  disabled={editMode}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='roleUids' label='Roles (Opcional)'>
            <Select
              placeholder='Seleccionar roles'
              allowClear
              size='large'
              mode='multiple'
              maxTagCount='responsive'
              showSearch
              filterOption={(input, option) => {
                const roleName = option?.label?.toString() || ''
                return roleName.toLowerCase().includes(input.toLowerCase())
              }}
            >
              {tenantRoles.map((role) => (
                <Option key={role.uid} value={role.uid} label={role.name}>
                  <div>
                    {role.name}
                    {role.description && (
                      <Text
                        type='secondary'
                        style={{ fontSize: '12px', marginLeft: '8px' }}
                      >
                        - {role.description}
                      </Text>
                    )}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {editMode && (
            <Form.Item
              name='status'
              label='Estado en la Empresa'
              valuePropName='checked'
            >
              <Switch
                checkedChildren='Habilitado'
                unCheckedChildren='Deshabilitado'
                size='default'
              />
            </Form.Item>
          )}
        </Form>
      </Spin>
    </Drawer>
  )
}
