import React, { useEffect } from 'react'
import { Drawer, FloatButton, Transfer, Spin, message } from 'antd'
import { IoIosSave } from 'react-icons/io'
import { useSignal } from '@preact/signals-react'
import { IRole, IAssignPermissionsOption } from '@/interfaces'
import appRequests from '@/state/requests'
import { setAssignPermissionsToOptions } from '@/state/params/utils'
import type { TransferProps } from 'antd'
import './TenantRolePermissionsDrawer.scss'

interface TenantRolePermissionsDrawerProps {
  visible: boolean
  onClose: () => void
  tenantUid?: string
  role?: IRole | null
  onAssignPermissions: (
    roleUid: string,
    permissions: string[]
  ) => Promise<boolean>
}

export const TenantRolePermissionsDrawer: React.FC<
  TenantRolePermissionsDrawerProps
> = ({ visible, onClose, tenantUid, role, onAssignPermissions }) => {
  const loading = useSignal(false)
  const selectedKeys = useSignal<string[]>([])
  const allPermissions = useSignal<IAssignPermissionsOption[]>([])
  const assignedPermissions = useSignal<string[]>([])
  const permissionsLoading = useSignal(false)

  const loadAllPermissions = async () => {
    try {
      const response = await appRequests.Params.getAllPermissions({
        text: null,
      })
      const permissionsOptions = setAssignPermissionsToOptions(response.data)
      allPermissions.value = permissionsOptions
    } catch (error) {
      console.error('Error loading permissions:', error)
      message.error('Error al cargar los permisos disponibles')
    }
  }

  const loadRolePermissions = async () => {
    if (!role?.uid || !tenantUid) return

    try {
      permissionsLoading.value = true

      const response = await appRequests.Tenants.getRolePermissions({
        tenantUId: tenantUid,
        roleUId: role.uid,
      })

      assignedPermissions.value = response.data.map((item: any) => String(item))
    } catch (error) {
      console.error('Error loading role permissions:', error)
      message.error('Error al cargar los permisos del rol')
      assignedPermissions.value = []
    } finally {
      permissionsLoading.value = false
    }
  }

  useEffect(() => {
    if (visible) {
      loadAllPermissions()
      if (role?.uid && tenantUid) {
        loadRolePermissions()
      }
    }
  }, [visible, role?.uid, tenantUid])

  const handlePermissionsChange = (newPermissions: string[]) => {
    assignedPermissions.value = newPermissions
  }

  const handleAssignPermissions = async () => {
    if (!role?.uid) return

    loading.value = true
    try {
      await onAssignPermissions(role.uid, assignedPermissions.value)
    } finally {
      loading.value = false
    }
  }

  const filterOption = (
    inputValue: string,
    option: IAssignPermissionsOption
  ): boolean =>
    option.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
    option.description.toLowerCase().indexOf(inputValue.toLowerCase()) > -1

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    const stringKeys = newTargetKeys.map((key) => String(key))
    handlePermissionsChange(stringKeys)
  }

  const handleSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys
  ) => {
    const allSelected = [...sourceSelectedKeys, ...targetSelectedKeys].map(
      (key) => String(key)
    )
    selectedKeys.value = allSelected
  }

  if (permissionsLoading.value) {
    return (
      <Drawer
        title={`Asignar permisos - ${role?.name || 'Rol'}`}
        placement='right'
        width={900}
        onClose={onClose}
        open={visible}
        className='tenant-role-permissions-drawer'
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
          }}
        >
          <Spin size='large' tip='Cargando permisos del rol...' />
        </div>
      </Drawer>
    )
  }

  return (
    <Drawer
      title={`Asignar permisos - ${role?.name || 'Rol'}`}
      placement='right'
      width={900}
      onClose={onClose}
      open={visible}
      className='tenant-role-permissions-drawer'
      extra={
        <>
          {!loading.value && (
            <FloatButton
              className='permissions-save-button'
              type='primary'
              tooltip='Guardar permisos'
              icon={<IoIosSave />}
              onClick={handleAssignPermissions}
              shape='square'
            />
          )}
        </>
      }
    >
      <div className='tenant-role-permissions-content'>
        {role && (
          <div className='role-info'>
            <h4>{role.name}</h4>
            <p>{role.description || 'Sin descripción'}</p>
          </div>
        )}

        <div className='permissions-section'>
          <h4 className='section-title'>Asignación de permisos</h4>

          <Transfer
            showSearch
            showSelectAll
            dataSource={allPermissions.value}
            targetKeys={assignedPermissions.value}
            selectedKeys={selectedKeys.value}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            render={(item) => item.title}
            titles={['Permisos disponibles', 'Permisos asignados']}
            filterOption={filterOption}
            listStyle={{
              width: '45%',
              height: '500px',
            }}
            operations={['Asignar', 'Quitar']}
            locale={{
              itemUnit: 'permiso',
              itemsUnit: 'permisos',
              searchPlaceholder: 'Buscar permisos...',
              notFoundContent: 'No se encontraron permisos',
            }}
          />
        </div>
      </div>
    </Drawer>
  )
}
