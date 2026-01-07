/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { type Signal, useSignal } from '@preact/signals-react'
import { useEffect } from 'react'
import { consoleLog } from 'wd-util/dist/helpers/consoleLog'

import { createNotification } from '@/components/notification'
import { type IPermission } from '@/interfaces'
import { ParamsState, PermissionsState } from '@/state'
import { paramsStateActions, permissionsStateActions } from '@/state/actions'

interface IGetPermissionsList {
  loading: Signal<boolean>
}
export const useGetPermissionsList = (): IGetPermissionsList => {
  const loading = useSignal(false)
  const { page, pageSize } = PermissionsState.pagination.value

  const handleGetPermissionsList = (): void => {
    loading.value = true
    permissionsStateActions
      .getPermissionsList()
      .catch((error) => {
        createNotification('error', 'Error', error.message as string)
        consoleLog.error('GETPERMISSIONSLIST::ERROR', error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  useEffect(() => {
    handleGetPermissionsList()
  }, [PermissionsState.activeType.value, page, pageSize])

  return {
    loading,
  }
}

interface IUsePermissionResult {
  handleCreatePermission: (permissionData: IPermission) => void
  handleDeletePermission: (permissionUId: string) => void
  handleEditPermission: (permissionUId: string) => void
  handleUpdatePermission: (permissionData: IPermission) => void
  loading: Signal<{
    create: boolean
    delete: boolean
    edit: boolean
    update: boolean
  }>
}
export const usePermission = (): IUsePermissionResult => {
  const loading = useSignal({
    create: false,
    delete: false,
    edit: false,
    update: false,
  })

  const handleEditPermission = (permissionUId: string): void => {
    loading.value = { ...loading.peek(), edit: true }
    permissionsStateActions
      .editPermission(permissionUId)
      .catch((error) => {
        createNotification(
          'error',
          'Error',
          'Error obteniendo la información del permiso'
        )
        consoleLog.error('GETPERMISSIONINFO::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), edit: false }
      })
  }
  const handleUpdatePermission = (permissionData: IPermission): void => {
    loading.value = { ...loading.peek(), update: true }
    permissionsStateActions
      .updatePermission(permissionData)
      .then(() =>
        createNotification(
          'success',
          'Permiso actualizado',
          'El permiso ha sido actualizado correctamente'
        )
      )
      .catch((error) => {
        createNotification(
          'error',
          'Error',
          'Error actualizando la información del permiso'
        )
        consoleLog.error('UPDATEPERMISSION::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), update: false }
      })
  }
  const handleCreatePermission = (permissionData: IPermission): void => {
    loading.value = { ...loading.peek(), create: true }
    permissionsStateActions
      .createPermission(permissionData)
      .then(() =>
        createNotification(
          'success',
          'Permiso creado',
          'El permiso ha sido creado correctamente'
        )
      )
      .catch((error) => {
        createNotification('error', 'Error', 'Error creando el nuevo permiso')
        consoleLog.error('CREATEPERMISSION::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), create: false }
      })
  }
  const handleDeletePermission = (permissionUId: string): void => {
    loading.value = { ...loading.peek(), delete: true }
    permissionsStateActions
      .deletePermission(permissionUId)
      .then(() =>
        createNotification(
          'success',
          'Permiso eliminado',
          'El permiso ha sido eliminado correctamente'
        )
      )
      .catch((error) => {
        createNotification('error', 'Error', 'Error eliminando el permiso')
        consoleLog.error('DELETEPERMISSION::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), delete: false }
      })
  }

  return {
    handleCreatePermission,
    handleDeletePermission,
    handleEditPermission,
    handleUpdatePermission,
    loading,
  }
}

interface ISearchPermissionResult {
  loadingSearch: Signal<boolean>
}

export const useSearchPermissions = (): ISearchPermissionResult => {
  const loadingSearch = useSignal(false)

  const handleSearchPermissions = (): void => {
    loadingSearch.value = true
    paramsStateActions
      .searchPermisions()
      .catch((error) => {
        createNotification('error', 'Error', 'Error eliminando el permiso')
        consoleLog.error('DELETEPERMISSION::ERROR', error)
      })
      .finally(() => {
        loadingSearch.value = false
      })
  }

  useEffect(() => {
    handleSearchPermissions()
  }, [ParamsState.searchPermissionsText.value])

  return {
    loadingSearch,
  }
}
