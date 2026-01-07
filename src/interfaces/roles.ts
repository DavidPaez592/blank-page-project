import { type Signal } from '@preact/signals-react'

import type { IPagination, ModelBase } from './common'
export interface IRole extends ModelBase {
  code?: string
  default?: boolean
  deletable?: boolean | null
  description?: string | null
  id?: number
  modifiable?: boolean | null
  name?: string
}

export interface IRolePermission extends ModelBase {
  permissionId?: number
  roleId?: number
}

export interface IRolePagination extends IPagination {
  data: IRole[]
}
export interface IRolesState {
  currentRole: Signal<IRole>
  openDrawer: Signal<boolean>
  openPermissionsDrawer: Signal<boolean>
  pagination: Signal<IRolePagination>
  permissions: Signal<string[]>
  roles: Signal<IRole[]>
}

export interface IRoleOption {
  label: string
  value: string
}
