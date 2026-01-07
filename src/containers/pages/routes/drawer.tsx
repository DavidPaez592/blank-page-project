import { RoutesState } from '@/state'
import { routesStateActions } from '@/state/actions'
import { Drawer, FloatButton, Form } from 'antd'
import { useMemo, useEffect } from 'react'
import { MdAddCircle } from 'react-icons/md'
import { useComputed } from '@preact/signals-react'
import { GrUpdate } from 'react-icons/gr'
import { useRoute } from '@/hooks/useRoutes'

import RouteForm from './form'

export default function RoutesDrawer() {
  const [routeForm] = Form.useForm()
  const { handleUpdateRoute, handleCreateRoute, loading } = useRoute()

  const isUpdating = useComputed(() => {
    return Boolean(RoutesState.currentRoute.value.uid)
  })

  const { drawerTitle, btnTooltipText } = useMemo(() => {
    if (isUpdating.value) {
      return { drawerTitle: 'Actualizar Ruta', btnTooltipText: 'Actualizar' }
    }

    return { drawerTitle: 'Crear Ruta', btnTooltipText: 'Crear' }
  }, [isUpdating.value])

  const handleConfirmBtn = () => {
    routeForm.validateFields().then((values) => {
      if (RoutesState.currentRoute.peek().uid) {
        return handleUpdateRoute(values)
      }

      return handleCreateRoute(values)
    })
  }

  useEffect(() => {
    routeForm.setFieldsValue(RoutesState.currentRoute.value)
    return routeForm.resetFields
  }, [RoutesState.currentRoute.value])

  return (
    <Drawer
      className='route-drawer'
      destroyOnClose
      maskClosable={false}
      open={RoutesState.openDrawer.value}
      title={drawerTitle}
      onClose={routesStateActions.toggleOpenDrawer}
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
      <RouteForm form={routeForm} />
    </Drawer>
  )
}
