import { useComputed } from '@preact/signals-react'
import { Drawer, FloatButton, Form } from 'antd'
import { useEffect, useMemo } from 'react'
import { GrUpdate } from 'react-icons/gr'
import { MdAddCircle } from 'react-icons/md'

import { useTenant } from '@/hooks/useTenants'
import { TenantsState } from '@/state'
import { tenantsStateActions } from '@/state/actions'
import TenantForm from '../form'

export const TenantsFormDrawer: React.FC = (): JSX.Element => {
  const [tenantForm] = Form.useForm()
  const { handleUpdateTenant, handleCreateTenant, loading } = useTenant()

  const isUpdating = useComputed(() => {
    return Boolean(TenantsState.currentTenant.value.uid)
  })

  const { drawerTitle, btnTooltipText } = useMemo(() => {
    if (isUpdating.value) {
      return { drawerTitle: 'Actualizar Empresa', btnTooltipText: 'Actualizar' }
    }

    return { drawerTitle: 'Crear Empresa', btnTooltipText: 'Crear' }
  }, [isUpdating.value])

  const handleConfirmBtn = () => {
    tenantForm.validateFields().then((values) => {
      if (TenantsState.currentTenant.peek().uid) {
        return handleUpdateTenant(values)
      }

      return handleCreateTenant(values)
    })
  }

  useEffect(() => {
    tenantForm.setFieldsValue(TenantsState.currentTenant.value)
    return tenantForm.resetFields
  }, [TenantsState.currentTenant.value])

  return (
    <Drawer
      className='tenant-form-drawer'
      destroyOnClose
      maskClosable={false}
      open={TenantsState.openDrawer.value}
      title={drawerTitle}
      onClose={tenantsStateActions.toggleOpenDrawer}
      extra={
        <>
          {!(loading.value.create || loading.value.update) && (
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
      <TenantForm form={tenantForm} />
    </Drawer>
  )
}

export default TenantsFormDrawer
