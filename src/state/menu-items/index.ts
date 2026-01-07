/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Signal, signal } from '@preact/signals-react'

import {
  type IMenuItem,
  type IMenuItemPagination,
  type IMenuItemsState,
} from '@/interfaces'

const menuItems: Signal<IMenuItem[]> = signal([])
const currentMenuItem: Signal<IMenuItem> = signal({
  key: '',
  url: '',
})
const openDrawer: Signal<boolean> = signal(false)
const pagination: Signal<IMenuItemPagination> = signal({
  data: [],
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 30, 50],
  total: 0,
})

export const MenuItemsState: IMenuItemsState = {
  currentMenuItem,
  menuItems,
  openDrawer,
  pagination,
}
