/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { type Signal, useSignal } from '@preact/signals-react'
import { useEffect } from 'react'
import { consoleLog } from 'wd-util/dist/helpers/consoleLog'

import { createNotification } from '@/components/notification'
import { type ITenant } from '@/interfaces'
import { TenantsState } from '@/state'
import { tenantsStateActions } from '@/state/actions'

interface IGetTenantsList {
  loading: Signal<boolean>
}
export const useGetTenantsList = (): IGetTenantsList => {
  const loading = useSignal(false)
  const { page, pageSize } = TenantsState.pagination.value

  const handleGetTenantsList = (): void => {
    loading.value = true

    tenantsStateActions
      .getTenantsList()
      .catch((error: { message: string }) => {
        createNotification('error', 'Error', error.message)
        consoleLog.error('GETTENANTSLIST::ERROR', error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  useEffect(() => {
    handleGetTenantsList()
  }, [page, pageSize])

  return {
    loading,
  }
}

interface IUseTenantResult {
  handleCreateTenant: (tenantData: ITenant) => void
  handleDeleteTenant: (tenantUId: string) => void
  handleEditTenant: (tenantUId: string) => void
  handleUpdateTenant: (tenantData: ITenant) => void
  loading: Signal<{
    create: boolean
    delete: boolean
    edit: boolean
    update: boolean
  }>
}
export const useTenant = (): IUseTenantResult => {
  const loading = useSignal({
    create: false,
    delete: false,
    edit: false,
    update: false,
  })

  const handleEditTenant = (tenantUId: string): void => {
    loading.value = { ...loading.peek(), edit: true }
    tenantsStateActions
      .editTenant(tenantUId)
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error obteniendo la información del tenant'
        )
        consoleLog.error('GETTENANTINFO::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), edit: false }
      })
  }

  const handleUpdateTenant = (tenantData: ITenant): void => {
    loading.value = { ...loading.peek(), update: true }
    tenantsStateActions
      .updateTenant(tenantData)
      .then(() =>
        createNotification(
          'success',
          'Tenant actualizado',
          'El tenant ha sido actualizado correctamente'
        )
      )
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error actualizando la información del tenant'
        )
        consoleLog.error('UPDATETENANT::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), update: false }
      })
  }

  const handleCreateTenant = (tenantData: ITenant): void => {
    loading.value = { ...loading.peek(), create: true }
    tenantsStateActions
      .createTenant(tenantData)
      .then(() =>
        createNotification(
          'success',
          'Tenant creado',
          'El tenant ha sido creado correctamente'
        )
      )
      .catch((error: any) => {
        createNotification('error', 'Error', 'Error creando el tenant')
        consoleLog.error('CREATETENANT::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), create: false }
      })
  }

  const handleDeleteTenant = (tenantUId: string): void => {
    loading.value = { ...loading.peek(), delete: true }
    tenantsStateActions
      .deleteTenant(tenantUId)
      .then(() =>
        createNotification(
          'success',
          'Tenant eliminado',
          'El tenant ha sido eliminado correctamente'
        )
      )
      .catch((error: any) => {
        createNotification('error', 'Error', 'Error eliminando el tenant')
        consoleLog.error('DELETETENANT::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), delete: false }
      })
  }

  return {
    handleCreateTenant,
    handleDeleteTenant,
    handleEditTenant,
    handleUpdateTenant,
    loading,
  }
}
