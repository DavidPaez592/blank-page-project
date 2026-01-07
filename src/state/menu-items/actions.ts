import { batch } from '@preact/signals-react'

import { type IMenuItem } from '@/interfaces'
import { MenuItemsState } from '@/state'

import { paramsStateActions } from '../actions'
import appRequests from '../requests'

export const menuItemsStateActions = {
  addMenuItem: async () => {
    await paramsStateActions.getMenuItemsParents()
    batch(() => {
      MenuItemsState.currentMenuItem.value = {
        key: '',
        url: '',
      }
      MenuItemsState.openDrawer.value = true
    })
  },
  changePagination: (page: number, pageSize: number) => {
    MenuItemsState.pagination.value = {
      ...MenuItemsState.pagination.peek(),
      page,
      pageSize,
    }
  },
  createMenuItem: async (menuItemData: IMenuItem) => {
    const { data: menuItemResponse } =
      await appRequests.MenuItems.createMenuItem(menuItemData)

    const currentPaginationData = MenuItemsState.pagination.peek()

    batch(() => {
      MenuItemsState.pagination.value = {
        ...currentPaginationData,
        data: [menuItemResponse, ...currentPaginationData.data],
        total: currentPaginationData.total + 1,
      }
      MenuItemsState.currentMenuItem.value = { key: '', url: '' }
      MenuItemsState.openDrawer.value = false
    })
  },
  deleteMenuItem: async (menuItemUId: string) => {
    await appRequests.MenuItems.deleteMenuItem(menuItemUId)

    const currentPaginationData = MenuItemsState.pagination.peek()
    MenuItemsState.pagination.value = {
      ...currentPaginationData,
      data: [...currentPaginationData.data].filter(
        (item) => item.uid !== menuItemUId
      ),
      total: currentPaginationData.total - 1,
    }
  },
  editMenuItem: async (menuItemUId: string) => {
    const [{ data: menuItemData }] = await Promise.all([
      appRequests.MenuItems.menuItemDetail(menuItemUId),
      paramsStateActions.getMenuItemsParents(),
    ])

    batch(() => {
      menuItemData.uid = menuItemUId
      MenuItemsState.currentMenuItem.value = menuItemData
      MenuItemsState.openDrawer.value = true
    })
  },
  getMenuItemsList: async () => {
    const { page, pageSize } = MenuItemsState.pagination.peek()
    const { data: response } = await appRequests.MenuItems.getList({
      limit: pageSize,
      page,
    })

    MenuItemsState.pagination.value = {
      ...MenuItemsState.pagination.peek(),
      data: response.rows,
      total: response.count,
    }
  },
  toggleOpenDrawer: () => {
    MenuItemsState.openDrawer.value = !MenuItemsState.openDrawer.peek()
  },
  updateMenuItem: async (menuItemData: IMenuItem) => {
    menuItemData.uid = MenuItemsState.currentMenuItem.peek().uid

    await appRequests.MenuItems.updateMenuItem(menuItemData)

    const currentPaginationData = MenuItemsState.pagination.peek()

    let currentMenuItemsData = [...currentPaginationData.data]

    currentMenuItemsData = currentMenuItemsData.map((item) => {
      if (item.uid === menuItemData.uid) return menuItemData
      return item
    })

    batch(() => {
      MenuItemsState.pagination.value = {
        ...currentPaginationData,
        data: currentMenuItemsData,
      }

      MenuItemsState.currentMenuItem.value = { key: '', url: '' }
      MenuItemsState.openDrawer.value = false
    })
  },
}
