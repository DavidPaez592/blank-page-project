/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Signal, useSignal } from '@preact/signals-react'
import { useEffect } from 'react'
import { consoleLog } from 'wd-util/dist/helpers/consoleLog'

import { createNotification } from '@/components/notification'
import { type IUser } from '@/interfaces'
import { UsersState, CashBoxesState } from '@/state'
import { usersStateActions } from '@/state/actions'

interface IGetUsersList {
  loading: Signal<boolean>
}

export const useGetUsersList = (): IGetUsersList => {
  const loading = useSignal(false)
  const { page, pageSize } = UsersState.pagination.value
  const { text } = UsersState.filters.value

  const handleGetUsersList = (): void => {
    loading.value = true
    usersStateActions
      .getUsersList()
      .catch((error: { message: string }) => {
        createNotification('error', 'Error', error.message)
        consoleLog.error('GETUSERLIST::ERROR', error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  useEffect(() => {
    handleGetUsersList()
  }, [text, page, pageSize])

  return {
    loading,
  }
}

interface IUseUserResult {
  handleCreateUser: (userData: IUser) => void
  handleDeleteUser: (userId: string) => void
  handleEditUser: (userId: string) => void
  handleUpdateUser: (userData: IUser) => void
  loading: Signal<{
    create: boolean
    default: boolean
    delete: boolean
    edit: boolean
    update: boolean
  }>
}
export const useUser = (): IUseUserResult => {
  const loading = useSignal({
    create: false,
    default: false,
    delete: false,
    edit: false,
    update: false,
  })

  const handleEditUser = (userUId: string): void => {
    loading.value = { ...loading.peek(), edit: true }
    usersStateActions
      .editUser(userUId)
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error obteniendo la información del usuario'
        )
        consoleLog.error('GETUSERINFO::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), edit: false }
      })
  }

  const handleUpdateUser = (userData: IUser): void => {
    loading.value = { ...loading.peek(), update: true }
    usersStateActions
      .updateUser(userData)
      .then(() =>
        createNotification(
          'success',
          'Usuario actualizado',
          'El usuario ha sido actualizado correctamente'
        )
      )
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error actualizando la información del usuario'
        )
        consoleLog.error('UPDATEUSER::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), update: false }
      })
  }

  const handleCreateUser = (userData: IUser): void => {
    loading.value = { ...loading.peek(), create: true }
    usersStateActions
      .createUser(userData)
      .then(() =>
        createNotification(
          'success',
          'Usuario creado',
          'El usuario ha sido creado correctamente'
        )
      )
      .catch((error: any) => {
        createNotification('error', 'Error', 'Error creando el usuario')
        consoleLog.error('CREATEUSER::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), create: false }
      })
  }

  const handleDeleteUser = (userUId: string): void => {
    loading.value = { ...loading.peek(), delete: true }
    usersStateActions
      .deleteUser(userUId)
      .then(() =>
        createNotification(
          'success',
          'Usuario eliminado',
          'El usuario ha sido eliminado correctamente'
        )
      )
      .catch((error: any) => {
        createNotification('error', 'Error', 'Error eliminando el usuario')
        consoleLog.error('DELETEUSER::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), delete: false }
      })
  }

  return {
    handleCreateUser,
    handleDeleteUser,
    handleEditUser,
    handleUpdateUser,
    loading,
  }
}

interface IUseUserPermissionsResult {
  handleAssignPermissions: () => void
  handleGetPermissions: (userUId: string) => void
  loading: Signal<{
    assign: boolean
    get: boolean
  }>
}
export const useUserPermissions = (): IUseUserPermissionsResult => {
  const loading = useSignal({
    assign: false,
    get: false,
  })

  const handleAssignPermissions = (): void => {
    loading.value = { ...loading.peek(), assign: true }
    usersStateActions
      .assignPermissions()
      .then(() =>
        createNotification(
          'success',
          'Permisos asignados',
          'Los permisos se han asignado correctamente al usuario'
        )
      )
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error asignando los permisos al usuario'
        )
        consoleLog.error('ASSIGNUSERPERMISSIONSINFO::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), assign: false }
      })
  }

  const handleGetPermissions = (userUId: string): void => {
    loading.value = { ...loading.peek(), get: true }
    usersStateActions
      .showPermissionDrawer(userUId)
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error obteniendo los permisos del usuario'
        )
        consoleLog.error('GETUSERPERMISSIONSINFO::ERROR', error)
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

interface IUseUserGetPermissionsResult {
  loading: Signal<boolean>
}
export const useGetUserPermissions = (): IUseUserGetPermissionsResult => {
  const loading = useSignal(false)

  const handleGetUserPermissions = (): void => {
    loading.value = true
    usersStateActions
      .getPermissions()
      .catch(() => {
        createNotification(
          'error',
          'Error',
          'Error obteniendo los permisos del usuario'
        )
      })
      .finally(() => {
        loading.value = false
      })
  }

  useEffect(() => {
    handleGetUserPermissions()
  }, [CashBoxesState.currentPermissionsRoleUId.value])
  return {
    loading,
  }
}

interface IUseUserTenantsResult {
  handleGetUserCashBoxes: (userUId: string) => void
  loadingCashbox: Signal<{
    get: boolean
    update: boolean
    insert: boolean
  }>
}

export const useCashBoxes = (): IUseUserTenantsResult => {
  const loadingCashbox = useSignal({
    get: false,
    update: false,
    insert: false,
  })

  const handleGetUserCashBoxes = (userUId: string): void => {
    loadingCashbox.value = { ...loadingCashbox.peek(), get: true }

    usersStateActions
      .getUserCashBoxes(userUId)
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error obteniendo los cashboxes del usuario'
        )
        consoleLog.error('GETUSERCASHBOXES::ERROR', error)
      })
      .finally(() => {
        loadingCashbox.value = { ...loadingCashbox.peek(), get: false }
      })
  }

  return {
    handleGetUserCashBoxes,
    loadingCashbox,
  }
}
