import { CheckAccess } from '@/components/checkAccess'
import { PERMISSIONS_LIST } from '@/constants'
import { useRole, useRolePermissions } from '@/hooks/useRoles'
import { IRole } from '@/interfaces'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { BsStarFill } from 'react-icons/bs'
import { FaUserShield } from 'react-icons/fa6'
import { MdDeleteForever, MdEditSquare } from 'react-icons/md'

export default function RoleTableActions({ roleData }: { roleData: IRole }) {
  const { handleEditRole, handleDeleteRole, handleSetDefault, loading } =
    useRole()
  const { loading: loadingPermissions, handleGetPermissions } =
    useRolePermissions()

  const handleEdit = () => {
    handleEditRole(roleData.uid as string)
  }

  const handleDelete = () => {
    handleDeleteRole(roleData.uid as string)
  }

  const handleDefaultClick = () => {
    handleSetDefault(roleData.uid as string)
  }

  const handlePermissionsClick = () => {
    handleGetPermissions(roleData.uid as string)
  }

  return (
    <Space size='middle' align='center'>
      {roleData.default && (
        <Tooltip title={'Rol por defecto'}>
          <BsStarFill
            title='Rol por defecto'
            size={20}
            color='orange'
            cursor='pointer'
          />
        </Tooltip>
      )}
      {roleData.modifiable && !roleData.default && (
        <CheckAccess
          permission={[
            PERMISSIONS_LIST.RolesUpdate,
            PERMISSIONS_LIST.RolesDefault,
          ]}
        >
          <Popconfirm
            title='¿Configurar rol por defecto?'
            okText='Sí, poner por defecto'
            cancelText='No, cancelar'
            placement='left'
            onConfirm={handleDefaultClick}
            okButtonProps={{
              disabled: loading.value.default,
              loading: loading.value.default,
            }}
          >
            <Tooltip title={'Configurar por defecto'}>
              <BsStarFill
                title='Configurar por defecto'
                size={20}
                color='grey'
                cursor='pointer'
              />
            </Tooltip>
          </Popconfirm>
        </CheckAccess>
      )}
      {roleData.modifiable && (
        <CheckAccess permission={PERMISSIONS_LIST.RolesUpdate}>
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
            />
          </Tooltip>
        </CheckAccess>
      )}
      {roleData.deletable && (
        <CheckAccess permission={PERMISSIONS_LIST.RolesDelete}>
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
              />
            </Popconfirm>
          </Tooltip>
        </CheckAccess>
      )}
      {roleData.modifiable && (
        <CheckAccess permission={[PERMISSIONS_LIST.RolesAssignPermissions]}>
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
      )}
    </Space>
  )
}
