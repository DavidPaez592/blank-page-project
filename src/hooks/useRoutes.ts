/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { type Signal, useSignal } from '@preact/signals-react'
import { useEffect } from 'react'
import { consoleLog } from 'wd-util/dist/helpers/consoleLog'

import { createNotification } from '@/components/notification'
import { type IRoute } from '@/interfaces'
import { RoutesState } from '@/state'
import { routesStateActions } from '@/state/actions'

interface IGetRoutesList {
  loading: Signal<boolean>
}
export const useGetRoutesList = (): IGetRoutesList => {
  const loading = useSignal(false)
  const { page, pageSize } = RoutesState.pagination.value

  const handleGetRoutesList = (): void => {
    loading.value = true
    routesStateActions
      .getRoutesList()
      .catch((error: { message: string }) => {
        createNotification('error', 'Error', error.message)
        consoleLog.error('GETROUTELIST::ERROR', error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  useEffect(() => {
    handleGetRoutesList()
  }, [page, pageSize])

  return {
    loading,
  }
}

interface IUseRouteResult {
  handleCreateRoute: (routeData: IRoute) => void
  handleDeleteRoute: (routeUId: string) => void
  handleEditRoute: (routeUId: string) => void
  handleUpdateRoute: (routeData: IRoute) => void
  loading: Signal<{
    create: boolean
    delete: boolean
    edit: boolean
    update: boolean
  }>
}
export const useRoute = (): IUseRouteResult => {
  const loading = useSignal({
    create: false,
    delete: false,
    edit: false,
    update: false,
  })

  const handleEditRoute = (routeUId: string): void => {
    loading.value = { ...loading.peek(), edit: true }
    routesStateActions
      .editRoute(routeUId)
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error obteniendo la información de la ruta'
        )
        consoleLog.error('GETROUTEINFO::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), edit: false }
      })
  }

  const handleUpdateRoute = (routeData: IRoute): void => {
    loading.value = { ...loading.peek(), update: true }
    routesStateActions
      .updateRoute(routeData)
      .then(() =>
        createNotification(
          'success',
          'Ruta actualizada',
          'La ruta ha sido actualizada correctamente'
        )
      )
      .catch((error: any) => {
        createNotification(
          'error',
          'Error',
          'Error actualizando la información de la ruta'
        )
        consoleLog.error('UPDATEROUTE::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), update: false }
      })
  }

  const handleCreateRoute = (routeData: IRoute): void => {
    loading.value = { ...loading.peek(), create: true }
    routesStateActions
      .createRoute(routeData)
      .then(() =>
        createNotification(
          'success',
          'Ruta creada',
          'La ruta ha sido creada correctamente'
        )
      )
      .catch((error: any) => {
        createNotification('error', 'Error', 'Error creando la ruta')
        consoleLog.error('CREATEROUTE::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), create: false }
      })
  }
  const handleDeleteRoute = (routeUId: string): void => {
    loading.value = { ...loading.peek(), delete: true }
    routesStateActions
      .deleteRoute(routeUId)
      .then(() =>
        createNotification(
          'success',
          'Ruta eliminada',
          'La ruta ha sido eliminada correctamente'
        )
      )
      .catch((error: any) => {
        createNotification('error', 'Error', 'Error eliminando la ruta')
        consoleLog.error('DELETEROUTE::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), delete: false }
      })
  }

  return {
    handleCreateRoute,
    handleDeleteRoute,
    handleEditRoute,
    handleUpdateRoute,
    loading,
  }
}
