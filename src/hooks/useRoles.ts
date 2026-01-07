/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { type Signal, useSignal } from '@preact/signals-react'
import { useEffect } from 'react'
import { consoleLog } from 'wd-util/dist/helpers/consoleLog'

import { createNotification } from '@/components/notification'
import { type IRole } from '@/interfaces'
import { RolesState } from '@/state'
import { rolesStateActions } from '@/state/actions'

interface IGetRolesList {
  loading: Signal<boolean>
}
export const useGetRolesList = (): IGetRolesList => {
  const loading = useSignal(false)
  const { page, pageSize } = RolesState.pagination.value

  const handleGetRolesList = (): void => {
    loading.value = true

    rolesStateActions
      .getRolesList()
      .catch((error: { message: string }) => {
        createNotification('error', 'Error', error.message)
        consoleLog.error('GETROLELIST::ERROR', error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  useEffect(() => {
    handleGetRolesList()
  }, [page, pageSize])

  return {
    loading,
  }
}

interface IUseRoleResult {
  handleCreateRole: (roleData: IRole) => void
  handleDeleteRole: (roleUId: string) => void
  handleEditRole: (roleUId: string) => void
  handleSetDefault: (roleUId: string) => void
  handleUpdateRole: (roleData: IRole) => void
  loading: Signal<{
    create: boolean
    default: boolean
    delete: boolean
    edit: boolean
    update: boolean
  }>
}
export const useRole = (): IUseRoleResult => {
  const loading = useSignal({
    create: false,
    default: false,
    delete: false,
    edit: false,
    update: false,
  })

  const handleEditRole = (roleUId: string): void => {
    loading.value = { ...loading.peek(), edit: true }
    rolesStateActions
      .editRole(roleUId)
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error obteniendo la información del rol'
        )
        consoleLog.error('GETROLEINFO::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), edit: false }
      })
  }

  const handleUpdateRole = (roleData: IRole): void => {
    loading.value = { ...loading.peek(), update: true }
    rolesStateActions
      .updateRole(roleData)
      .then(() =>
        createNotification(
          'success',
          'Rol actualizado',
          'El rol ha sido actualizado correctamente'
        )
      )
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error actualizando la información del rol'
        )
        consoleLog.error('UPDATEROLE::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), update: false }
      })
  }

  const handleCreateRole = (roleData: IRole): void => {
    loading.value = { ...loading.peek(), create: true }
    rolesStateActions
      .createRole(roleData)
      .then(() =>
        createNotification(
          'success',
          'Rol creada',
          'El rol ha sido creado correctamente'
        )
      )
      .catch((error: any) => {
        createNotification('error', 'Error', 'Error creando el rol')
        consoleLog.error('CREATEROLE::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), create: false }
      })
  }

  const handleDeleteRole = (roleUId: string): void => {
    loading.value = { ...loading.peek(), delete: true }
    rolesStateActions
      .deleteRole(roleUId)
      .then(() =>
        createNotification(
          'success',
          'Rol eliminado',
          'El rol ha sido eliminado correctamente'
        )
      )
      .catch((error: any) => {
        createNotification('error', 'Error', 'Error eliminando el rol')
        consoleLog.error('DELETEROLE::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), delete: false }
      })
  }

  const handleSetDefault = (roleUId: string): void => {
    loading.value = { ...loading.peek(), default: true }
    rolesStateActions
      .setDefault(roleUId)
      .then(() =>
        createNotification(
          'success',
          'Rol por defecto actualizado',
          'El rol seleccionado ha sido actualizado como por defecto'
        )
      )
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error actualizando rol por defecto'
        )
        consoleLog.error('SETDEFAULTROLE::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), default: false }
      })
  }

  return {
    handleCreateRole,
    handleDeleteRole,
    handleEditRole,
    handleSetDefault,
    handleUpdateRole,
    loading,
  }
}

interface IUseRolePermissionsResult {
  handleAssignPermissions: () => void
  handleGetPermissions: (roleUId: string) => void
  loading: Signal<{
    assign: boolean
    get: boolean
  }>
}
export const useRolePermissions = (): IUseRolePermissionsResult => {
  const loading = useSignal({
    assign: false,
    get: false,
  })

  const handleAssignPermissions = (): void => {
    loading.value = { ...loading.peek(), assign: true }
    rolesStateActions
      .assignPermissions()
      .then(() =>
        createNotification(
          'success',
          'Permisos asignados',
          'Los permisos se han asignado correctamente al rol'
        )
      )
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error asignando los permisos al rol'
        )
        consoleLog.error('ASSIGNROLEPERMISSIONSINFO::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), assign: false }
      })
  }

  const handleGetPermissions = (roleUId: string): void => {
    loading.value = { ...loading.peek(), get: true }
    rolesStateActions
      .getPermissions(roleUId)
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error obteniendo los permisos al rol'
        )
        consoleLog.error('GETROLEPERMISSIONSINFO::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), get: false }
      })
  }

  return {
    handleAssignPermissions,
    handleGetPermissions,
    loading,
  }
}
