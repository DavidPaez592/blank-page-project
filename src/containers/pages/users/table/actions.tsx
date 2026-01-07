import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useUser, useUserPermissions, useUserTenants } from '@/hooks/useUsers'
import { IUser } from '@/interfaces'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { useState } from 'react'
import ManageUserOfficesDrawer from '@/containers/components/ManageUserOfficesDrawer'
import { FaUserShield } from 'react-icons/fa6'
import { DropboxOutlined } from '@ant-design/icons'
import {
  MdDeleteForever,
  MdEditSquare,
  MdBusiness,
  MdHomeWork,
} from 'react-icons/md'
import { useCashBoxes } from '@/hooks/useCashBoxes'

export default function UserTableActions({ userData }: { userData: IUser }) {
  const [officeDrawerOpen, setOfficeDrawerOpen] = useState(false)
  const [cashboxesDrawerOpen, setCashBoxesDrawerOpen] = useState(false)
  const { handleEditUser, handleDeleteUser, loading } = useUser()
  const { loading: loadingPermissions, handleGetPermissions } =
    useUserPermissions()
  const { loading: loadingTenants, handleGetUserTenants } = useUserTenants()
  const { loadingCashbox: loadingCashbox, handleGetUserCashBoxes } = useCashBoxes()

  const handleEdit = () => {
    handleEditUser(userData.uid as string)
  }

  const handleDelete = () => {
    handleDeleteUser(userData.uid as string)
  }

  const handlePermissionsClick = () => {
    handleGetPermissions(userData.uid as string)
  }

  const handleTenantUser = () => {
    handleGetUserTenants(userData.uid as string)
  }

  const handleCashBoxUser = () => {
    handleGetUserCashBoxes(userData.uid as string)
    //setCashBoxesDrawerOpen(true)
  }

  const handleOpenAssignOffice = () => {
    setOfficeDrawerOpen(true)
  }

  return (
    <Space size='middle' align='center'>
      <CheckAccess permission={PERMISSIONS_LIST.UsersUpdate}>
        <Tooltip title='Editar'>
          <Button
            style={{ borderRadius: '50%', padding: '5px' }}
            onClick={handleEdit}
            loading={loading.value.edit}
            disabled={loading.value.edit}
            size='middle'
            icon={
              <MdEditSquare
                title='Editar'
                size={20}
                color='grey'
                cursor='pointer'
              />
            }
          ></Button>
        </Tooltip>
      </CheckAccess>

      <CheckAccess permission={PERMISSIONS_LIST.UsersDelete}>
        <Tooltip placement='right' title='Eliminar'>
          <Popconfirm
            title='¿Eliminar esta ruta?'
            okText='Sí, eliminar'
            cancelText='No, cancelar'
            placement='left'
            onConfirm={handleDelete}
            okButtonProps={{
              disabled: loading.value.delete,
              loading: loading.value.delete,
            }}
          >
            <Button
              style={{ borderRadius: '50%', padding: '5px' }}
              icon={
                <MdDeleteForever
                  title='Eliminar'
                  size={20}
                  color='red'
                  cursor='pointer'
                />
              }
            ></Button>
          </Popconfirm>
        </Tooltip>
      </CheckAccess>

      <CheckAccess permission={[PERMISSIONS_LIST.UsersAssignPermissions]}>
        <Tooltip title={'Asignar permisos'}>
          <Button
            style={{ borderRadius: '50%', padding: '5px' }}
            onClick={handlePermissionsClick}
            loading={loadingPermissions.value.get}
            disabled={loadingPermissions.value.get}
            size='middle'
            icon={
              <FaUserShield
                title='Asignar permisos'
                size={20}
                cursor='pointer'
              />
            }
          />
        </Tooltip>
      </CheckAccess>

      <CheckAccess permission={[PERMISSIONS_LIST.UsersAssignTenant]}>
        <Tooltip title={'Gestionar empresas'}>
          <Button
            style={{ borderRadius: '50%', padding: '5px' }}
            onClick={handleTenantUser}
            loading={loadingTenants.value.get}
            disabled={loadingTenants.value.get}
            size='middle'
            icon={
              <MdBusiness
                title='Gestionar empresas'
                size={20}
                cursor='pointer'
              />
            }
          />
        </Tooltip>
      </CheckAccess>

      <CheckAccess permission={[PERMISSIONS_LIST.UsersAssignTenant]}>
        <Tooltip title={'Gestionar Cajas'}>
          <Button
            style={{ borderRadius: '50%', padding: '5px' }}
            onClick={handleCashBoxUser}
            loading={loadingCashbox.value.get}
            disabled={loadingCashbox.value.get}
            size='middle'
            icon={
              <DropboxOutlined
                title='Gestionar Cajas'
                size={20}
                //cursor='pointer'
              />
            }
          />
        </Tooltip>
      </CheckAccess>
    </Space>
  )
}
