import { useComputed } from '@preact/signals-react'
import { Drawer, FloatButton, Form } from 'antd'
import { useEffect, useMemo } from 'react'
import { GrUpdate } from 'react-icons/gr'
import { MdAddCircle } from 'react-icons/md'

import { useRole } from '@/hooks/useRoles'
import { RolesState } from '@/state'
import { rolesStateActions } from '@/state/actions'
import RoleForm from '../form'

/**
 * RolesFormDrawer component
 *
 * This component renders a drawer containing a form for creating or updating a role. It includes fields for the role name,
 * description, and a switch to indicate if the role is modifiable. The form is disabled if the current role is not modifiable
 * and has an ID. The drawer title and button tooltip text change based on whether the form is for creating or updating a role.
 *
 * @returns {JSX.Element} The rendered component
 */
export const RolesFormDrawer: React.FC = (): JSX.Element => {
  const [roleForm] = Form.useForm()
  const { handleUpdateRole, handleCreateRole, loading } = useRole()

  const isUpdating = useComputed(() => {
    return Boolean(RolesState.currentRole.value.uid)
  })
  const isDisabled = useComputed(() =>
    Boolean(!RolesState.currentRole.value.modifiable && isUpdating.value)
  )

  const { drawerTitle, btnTooltipText } = useMemo(() => {
    if (isUpdating.value) {
      return { drawerTitle: 'Actualizar Rol', btnTooltipText: 'Actualizar' }
    }

    return { drawerTitle: 'Crear Rol', btnTooltipText: 'Crear' }
  }, [isUpdating.value])

  const handleConfirmBtn = () => {
    roleForm.validateFields().then((values) => {
      if (RolesState.currentRole.peek().uid) {
        return handleUpdateRole(values)
      }

      return handleCreateRole(values)
    })
  }

  useEffect(() => {
    roleForm.setFieldsValue(RolesState.currentRole.value)
    return roleForm.resetFields
  }, [RolesState.currentRole.value])

  return (
    <Drawer
      className='role-form-drawer'
      destroyOnClose
      maskClosable={false}
      open={RolesState.openDrawer.value}
      title={drawerTitle}
      onClose={rolesStateActions.toggleOpenDrawer}
      extra={
        <>
          {!(
            loading.value.create ||
            loading.value.update ||
            isDisabled.value
          ) && (
            <FloatButton
              style={{ position: 'relative', top: '0px', right: '0px' }}
              type='primary'
              tooltip={btnTooltipText}
              icon={isUpdating.value ? <GrUpdate /> : <MdAddCircle />}
              onClick={handleConfirmBtn}
              shape='square'
            />
          )}
        </>
      }
    >
      <RoleForm form={roleForm} />
    </Drawer>
  )
}

export default RolesFormDrawer
