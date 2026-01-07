import { PermissionsState } from '@/state'
import { permissionsStateActions } from '@/state/permissions/actions'
import { Drawer, FloatButton, Form } from 'antd'
import { useMemo, useEffect } from 'react'
import { MdAddCircle } from 'react-icons/md'
import { useComputed } from '@preact/signals-react'
import { GrUpdate } from 'react-icons/gr'
import { usePermission } from '@/hooks/usePermissions'

import PermissionForm from './form'

export default function PermissionsDrawer() {
  const [permissionForm] = Form.useForm()
  const { handleUpdatePermission, handleCreatePermission, loading } =
    usePermission()

  const isDisabled = useComputed(() =>
    Boolean(
      !PermissionsState.currentPermission.value.modifiable &&
        PermissionsState.currentPermission.value.uid
    )
  )
  const isUpdating = useComputed(() => {
    return Boolean(PermissionsState.currentPermission.value.uid)
  })

  const { drawerTitle, btnTooltipText } = useMemo(() => {
    if (isUpdating.value) {
      return { drawerTitle: 'Actualizar Permiso', btnTooltipText: 'Actualizar' }
    }

    return { drawerTitle: 'Crear Permiso', btnTooltipText: 'Crear' }
  }, [isUpdating.value])

  const handleConfirmBtn = () => {
    permissionForm.validateFields().then((values) => {
      if (PermissionsState.currentPermission.peek().uid) {
        return handleUpdatePermission(values)
      }

      return handleCreatePermission(values)
    })
  }

  useEffect(() => {
    permissionForm.setFieldsValue(PermissionsState.currentPermission.value)
    return permissionForm.resetFields
  }, [PermissionsState.currentPermission.value])

  return (
    <Drawer
      className='permission-drawer'
      destroyOnClose
      maskClosable={false}
      open={PermissionsState.openDrawer.value}
      title={drawerTitle}
      onClose={permissionsStateActions.toggleOpenDrawer}
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
      <PermissionForm form={permissionForm} />
    </Drawer>
  )
}
