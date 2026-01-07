import { useEffect } from 'react'
import { useSignal, type Signal } from '@preact/signals-react'
import {
  ITenant,
  IUser,
  IRole,
  EUserStatus,
  ETenantUserStatus,
} from '@/interfaces'
import { tenantsStateActions } from '@/state/tenants/actions'
import appRequests from '@/state/requests'
import { message } from 'antd'

/**
 * Custom hook for tenant detail operations using signals
 */
export const useTenantDetail = (tenantUid?: string) => {
  const loading = useSignal(false)
  const tenant = useSignal<ITenant | null>(null)
  const users = useSignal<IUser[]>([])
  const roles = useSignal<IRole[]>([]) // For select dropdown
  const paginatedRoles = useSignal<IRole[]>([]) // For table
  const rolesTotal = useSignal(0)
  const rolesCurrentPage = useSignal(1)
  const rolesPageSize = useSignal(10)
  const activeUsersCount = useSignal(0)
  const addingUser = useSignal(false)
  const addingRole = useSignal(false)
  const deletingRole = useSignal(false)
  const updatingRole = useSignal(false)

  useEffect(() => {
    if (tenantUid) {
      loadTenantDetail()
      loadTenantUsers()
      loadTenantRoles()
    }
  }, [tenantUid])

  const loadTenantDetail = async () => {
    if (!tenantUid) return

    try {
      loading.value = true

      await tenantsStateActions.getDetail(tenantUid)
    } catch (error) {
      message.error('Error al cargar el detalle del tenant')
    } finally {
      loading.value = false
    }
  }

  const loadTenantUsers = async () => {
    if (!tenantUid) return

    try {
      const response = await appRequests.Tenants.getTenantUsers(tenantUid)

      users.value = response.data.users || []
      activeUsersCount.value = users.value.filter(
        (user) => user.status === EUserStatus.ENABLED
      ).length
    } catch (error) {
      console.error('Error loading tenant users:', error)
      message.error('Error al cargar los usuarios del tenant')
    }
  }

  const loadTenantRoles = async () => {
    if (!tenantUid) return

    try {
      const response = await appRequests.Tenants.getTenantRoles(tenantUid)
      roles.value = response.data || []
    } catch (error) {
      console.error('Error loading tenant roles:', error)
      message.error('Error al cargar los roles del tenant')
    }
  }

  const loadTenantRolesPaginated = async (page?: number, pageSize?: number) => {
    if (!tenantUid) return

    try {
      const currentPage = page || rolesCurrentPage.value
      const currentPageSize = pageSize || rolesPageSize.value

      const response = await appRequests.Tenants.getTenantRolesPaginated({
        uid: tenantUid,
        page: currentPage,
        limit: currentPageSize,
      })

      paginatedRoles.value = response.data.roles || []
      rolesTotal.value = response.data.total || 0
      rolesCurrentPage.value = currentPage
      rolesPageSize.value = currentPageSize
    } catch (error) {
      console.error('Error loading paginated tenant roles:', error)
      message.error('Error al cargar los roles del tenant')
    }
  }

  const refreshTenantDetail = () => {
    loadTenantDetail()
    loadTenantUsers()
    loadTenantRoles()
  }

  const addUserToTenant = async (userData: any) => {
    if (!tenantUid) {
      message.error('ID del tenant no disponible')
      return false
    }

    try {
      addingUser.value = true

      await appRequests.Tenants.addUserToTenant({
        tenantUId: tenantUid,
        firstName: userData.firstName,
        firstSurname: userData.firstSurname,
        secondName: userData.secondName,
        secondSurname: userData.secondSurname,
        email: userData.email,
        identificationTypeUId: userData.identificationTypeUId,
        identificationNumber: userData.identificationNumber,
        roleUIds: userData.roleUids,
      })

      message.success('Usuario agregado al tenant exitosamente')

      await loadTenantUsers()

      return true
    } catch (error) {
      console.error('Error adding user to tenant:', error)
      message.error('Error al agregar usuario al tenant')
      return false
    } finally {
      addingUser.value = false
    }
  }

  const updateUserInTenant = async (
    userUid: string,
    status: ETenantUserStatus,
    userData?: {
      firstName?: string
      firstSurname?: string
      secondName?: string
      secondSurname?: string
      email?: string
    },
    roleUIds?: string[]
  ) => {
    if (!tenantUid) {
      message.error('ID del tenant no disponible')
      return false
    }

    try {
      await appRequests.Tenants.updateUserInTenant({
        tenantUId: tenantUid,
        userUId: userUid,
        status,
        roleUIds,
        ...userData,
      })

      message.success('Usuario actualizado exitosamente')
      await loadTenantUsers() // Refresh data
      return true
    } catch (error) {
      console.error('Error updating user in tenant:', error)
      message.error('Error al actualizar usuario en el tenant')
      return false
    }
  }

  const addRoleToTenant = async (roleData: {
    name: string
    description: string
    modifiable?: boolean
    deletable?: boolean
  }) => {
    if (!tenantUid) {
      message.error('ID del tenant no disponible')
      return false
    }

    try {
      addingRole.value = true

      await appRequests.Tenants.addRoleToTenant({
        uid: tenantUid,
        name: roleData.name,
        description: roleData.description,
        modifiable:
          roleData.modifiable !== undefined ? roleData.modifiable : true,
        deletable: roleData.deletable !== undefined ? roleData.deletable : true,
      })

      message.success('Rol agregado al tenant exitosamente')
      await loadTenantRoles()
      await loadTenantRolesPaginated()
      return true
    } catch (error) {
      console.error('Error adding role to tenant:', error)
      message.error('Error al agregar rol al tenant')
      return false
    } finally {
      addingRole.value = false
    }
  }

  const updateRoleInTenant = async (
    roleUid: string,
    roleData: {
      name: string
      description: string
      modifiable?: boolean
      deletable?: boolean
    }
  ) => {
    if (!tenantUid) {
      message.error('ID del tenant no disponible')
      return false
    }

    try {
      updatingRole.value = true

      await appRequests.Tenants.updateTenantRole({
        tenantUId: tenantUid,
        roleUId: roleUid,
        name: roleData.name,
        description: roleData.description,
        modifiable: roleData.modifiable,
        deletable: roleData.deletable,
      })

      message.success('Rol actualizado exitosamente')
      await loadTenantRoles()
      await loadTenantRolesPaginated()
      return true
    } catch (error) {
      console.error('Error updating role in tenant:', error)
      message.error('Error al actualizar rol del tenant')
      return false
    } finally {
      updatingRole.value = false
    }
  }

  const removeRoleFromTenant = async (roleUid: string) => {
    if (!tenantUid) {
      message.error('ID del tenant no disponible')
      return false
    }

    try {
      deletingRole.value = true

      await appRequests.Tenants.deleteTenantRole({
        tenantUId: tenantUid,
        roleUId: roleUid,
      })

      message.success('Rol eliminado del tenant exitosamente')
      await loadTenantRoles()
      await loadTenantRolesPaginated()
      return true
    } catch (error) {
      console.error('Error removing role from tenant:', error)
      message.error('Error al eliminar rol del tenant')
      return false
    } finally {
      deletingRole.value = false
    }
  }

  const assignRolePermissions = async (
    roleUid: string,
    permissions: string[]
  ) => {
    if (!tenantUid) {
      message.error('ID del tenant no disponible')
      return false
    }

    try {
      await appRequests.Tenants.assignRolePermissions({
        tenantUId: tenantUid,
        roleUId: roleUid,
        permissions,
      })

      message.success('Permisos asignados al rol exitosamente')
      return true
    } catch (error) {
      console.error('Error assigning permissions to role:', error)
      message.error('Error al asignar permisos al rol')
      return false
    }
  }

  return {
    loading,
    tenant,
    users,
    roles,
    paginatedRoles,
    rolesTotal,
    rolesCurrentPage,
    rolesPageSize,
    activeUsersCount,
    addingUser,
    addingRole,
    deletingRole,
    updatingRole,
    refreshTenantDetail,
    addUserToTenant,
    updateUserInTenant,
    addRoleToTenant,
    updateRoleInTenant,
    removeRoleFromTenant,
    loadTenantRolesPaginated,
    assignRolePermissions,
  }
}
