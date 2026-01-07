import { type Signal } from '@preact/signals-react'

import type { IPagination, ModelBase } from './common'
import type { EPermissionType } from './enums'

export interface IPermission extends ModelBase {
  code?: string
  deletable?: boolean
  description?: string
  modifiable?: boolean
  name?: string
  onlyDev?: boolean
  type?: EPermissionType
}

export interface IPermissionPagination extends IPagination {
  data: IPermission[]
}

export interface IPermissionsState {
  activeType: Signal<EPermissionType | null>
  currentPermission: Signal<IPermission>
  openDrawer: Signal<boolean>
  pagination: Signal<IPermissionPagination>
  permissions: Signal<IPermission[]>
}
