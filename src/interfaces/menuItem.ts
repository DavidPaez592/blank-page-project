import type { Signal } from '@preact/signals-react'

import type { IPagination, ModelBase } from './common'

export interface IMenuItem extends ModelBase {
  children?: IMenuItem[]
  icon?: string
  key: string
  label?: string
  order?: number
  parent?: number | null
  url: string
}

export interface IMenuItemPagination extends IPagination {
  data: IMenuItem[]
}
export interface IMenuItemsState {
  currentMenuItem: Signal<IMenuItem>
  menuItems: Signal<IMenuItem[]>
  openDrawer: Signal<boolean>
  pagination: Signal<IMenuItemPagination>
}
