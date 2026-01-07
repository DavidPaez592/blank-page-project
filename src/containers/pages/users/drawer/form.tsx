import { Drawer, FloatButton, Form } from 'antd'
import { useEffect, useMemo } from 'react'
import { GrUpdate } from 'react-icons/gr'
import { MdAddCircle } from 'react-icons/md'
import { useComputed } from '@preact/signals-react'

import { useUser } from '@/hooks/useUsers'
import { UsersState } from '@/state'
import { usersStateActions } from '@/state/actions'

import UserForm from '../form'

export const UsersFormDrawer: React.FC = (): JSX.Element => {
  const [userForm] = Form.useForm()
  const { handleUpdateUser, handleCreateUser, loading } = useUser()

  const isUpdating = useComputed(() => {
    return Boolean(UsersState.currentUser.value.uid)
  })

  const { drawerTitle, btnTooltipText } = useMemo(() => {
    if (isUpdating.value) {
      return { drawerTitle: 'Actualizar Usuario', btnTooltipText: 'Actualizar' }
    }

    return { drawerTitle: 'Crear Usuario', btnTooltipText: 'Crear' }
  }, [isUpdating.value])

  const handleConfirmBtn = () => {
    userForm.validateFields().then((values) => {
      if (UsersState.currentUser.peek().uid) {
        return handleUpdateUser(values)
      }

      return handleCreateUser(values)
    })
  }

  useEffect(() => {
    userForm.setFieldsValue(UsersState.currentUser.value)
    return userForm.resetFields
  }, [UsersState.currentUser.value])

  return (
    <Drawer
      className='user-form-drawer'
      destroyOnClose
      maskClosable={false}
      open={UsersState.openDrawer.value}
      title={drawerTitle}
      onClose={usersStateActions.toggleOpenDrawer}
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
      <UserForm form={userForm} />
    </Drawer>
  )
}

export default UsersFormDrawer
