import { type Signal } from '@preact/signals-react'

import type { IPagination, ModelBase } from './common'
import type { ERouteMethod } from './enums'
import type { IPermission } from './permissions'

export interface IRoute extends ModelBase {
  default?: boolean
  description?: string | null
  menuItemUId?: string | null
  method?: ERouteMethod
  name?: string
  path?: string
  permission?: IPermission | null
  permissionUId?: string | null
  private?: boolean
}

export interface IRoutePagination extends IPagination {
  data: IRoute[]
}
export interface IRoutesState {
  currentRoute: Signal<IRoute>
  openDrawer: Signal<boolean>
  pagination: Signal<IRoutePagination>
  routes: Signal<IRoute[]>
}
