/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { type Signal, useSignal } from '@preact/signals-react'
import { useEffect } from 'react'
import { consoleLog } from 'wd-util/dist/helpers/consoleLog'

import { createNotification } from '@/components/notification'
import { type IMenuItem } from '@/interfaces'
import { MenuItemsState } from '@/state'
import { menuItemsStateActions } from '@/state/menu-items/actions'

interface IGetMenuItemsList {
  loading: Signal<boolean>
}
export const useGetMenuItemsList = (): IGetMenuItemsList => {
  const loading = useSignal(false)
  const { page, pageSize } = MenuItemsState.pagination.value

  const handleGetMenuItemsList = (): void => {
    loading.value = true
    menuItemsStateActions
      .getMenuItemsList()
      .catch((error) => {
        createNotification('error', 'Error', error.message as string)
        consoleLog.error('GETMENUITEMLIST::ERROR', error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  useEffect(() => {
    handleGetMenuItemsList()
  }, [page, pageSize])

  return {
    loading,
  }
}

interface IUseMenuItemResult {
  handleCreateMenuItem: (menuItemData: IMenuItem) => void
  handleDeleteMenuItem: (menuItemUId: string) => void
  handleEditMenuItem: (menuItemUId: string) => void
  handleUpdateMenuItem: (menuItemData: IMenuItem) => void
  loading: Signal<{
    create: boolean
    delete: boolean
    edit: boolean
    update: boolean
  }>
}
export const useMenuItem = (): IUseMenuItemResult => {
  const loading = useSignal({
    create: false,
    delete: false,
    edit: false,
    update: false,
  })

  const handleEditMenuItem = (menuItemUId: string): void => {
    loading.value = { ...loading.peek(), edit: true }
    menuItemsStateActions
      .editMenuItem(menuItemUId)
      .catch((error) => {
        createNotification(
          'error',
          'Error',
          'Error obteniendo la información del menú'
        )
        consoleLog.error('GETMENUITEMINFO::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), edit: false }
      })
  }

  const handleUpdateMenuItem = (menuItemData: IMenuItem): void => {
    loading.value = { ...loading.peek(), update: true }
    menuItemsStateActions
      .updateMenuItem(menuItemData)
      .then(() =>
        createNotification(
          'success',
          'Opción de menú actualizado',
          'El menú ha sido actualizado correctamente'
        )
      )
      .catch((error) => {
        createNotification(
          'error',
          'Error',
          'Error actualizando la información del menú'
        )
        consoleLog.error('UPDATEMENUITEM::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), update: false }
      })
  }

  const handleCreateMenuItem = (menuItemData: IMenuItem): void => {
    loading.value = { ...loading.peek(), create: true }
    menuItemsStateActions
      .createMenuItem(menuItemData)
      .then(() =>
        createNotification(
          'success',
          'Opción de menú creado',
          'El menú ha sido creado correctamente'
        )
      )
      .catch((error) => {
        createNotification('error', 'Error', 'Error creando el nuevo menú')
        consoleLog.error('CREATEMENUITEM::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), create: false }
      })
  }
  const handleDeleteMenuItem = (menuItemUId: string): void => {
    loading.value = { ...loading.peek(), delete: true }
    menuItemsStateActions
      .deleteMenuItem(menuItemUId)
      .then(() =>
        createNotification(
          'success',
          'Opción de menú eliminado',
          'El menú ha sido eliminado correctamente'
        )
      )
      .catch((error) => {
        createNotification('error', 'Error', 'Error eliminando el menú')
        consoleLog.error('DELETEMENUITEM::ERROR', error)
      })
      .finally(() => {
        loading.value = { ...loading.peek(), delete: false }
      })
  }

  return {
    handleCreateMenuItem,
    handleDeleteMenuItem,
    handleEditMenuItem,
    handleUpdateMenuItem,
    loading,
  }
}
