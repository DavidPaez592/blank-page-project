import { MenuItemsState } from '@/state'
import { menuItemsStateActions } from '@/state/actions'
import { Drawer, FloatButton, Form } from 'antd'
import { useEffect, useMemo } from 'react'
import { MdAddCircle } from 'react-icons/md'
import { useComputed } from '@preact/signals-react'
import { GrUpdate } from 'react-icons/gr'
import { useMenuItem } from '@/hooks/useMenuItem'

import MenuItemForm from './form'

export default function MenuItemsDrawer() {
  const [menuItemForm] = Form.useForm()
  const { handleUpdateMenuItem, handleCreateMenuItem, loading } = useMenuItem()

  const isUpdating = useComputed(() => {
    return Boolean(MenuItemsState.currentMenuItem.value.uid)
  })

  const { drawerTitle, btnTooltipText } = useMemo(() => {
    if (isUpdating.value) {
      return { drawerTitle: 'Actualizar Menú', btnTooltipText: 'Actualizar' }
    }

    return {
      drawerTitle: 'Crear Menú',
      btnTooltipText: 'Crear',
    }
  }, [isUpdating.value])

  const handleConfirmBtn = () => {
    menuItemForm.validateFields().then((values) => {
      if (MenuItemsState.currentMenuItem.peek().uid) {
        return handleUpdateMenuItem(values)
      }

      return handleCreateMenuItem(values)
    })
  }

  useEffect(() => {
    menuItemForm.setFieldsValue(MenuItemsState.currentMenuItem.value)
    return menuItemForm.resetFields
  }, [MenuItemsState.currentMenuItem.value])

  return (
    <Drawer
      className='menu-item-drawer'
      destroyOnClose
      maskClosable={false}
      open={MenuItemsState.openDrawer.value}
      title={drawerTitle}
      onClose={menuItemsStateActions.toggleOpenDrawer}
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
      <MenuItemForm form={menuItemForm} />
    </Drawer>
  )
}
