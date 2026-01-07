import { type Signal } from '@preact/signals-react'

import type { ModelBase } from './common'
import { type EPermissionType } from './enums'
import { type IRoleOption } from './roles'

export interface IIdentificationType extends ModelBase {
  deletable?: boolean
  description?: string | null
  label?: string
  modifiable?: boolean
  value?: string | number
}

export interface IDocTypeOption {
  label?: string
  value?: string | number
}

export interface IPermissionTypesOptions {
  label?: string
  value?: EPermissionType
}

export interface IMenuItemsOptions {
  children?: IMenuItemsOptions[]
  label: string
  value: string
}

export interface IPermissionsOptions {
  uid?: string
  label: string
  type?: EPermissionType
  value: string
}

export interface IAssignPermissionsOption {
  description: string
  key: string
  title: string
}

export interface IParamsState {
  assignPermissions: Signal<IAssignPermissionsOption[]>
  docTypes: Signal<IIdentificationType[]>
  menuItems: Signal<IMenuItemsOptions[]>
  permissionTypes: Signal<IPermissionTypesOptions[]>
  permissions: Signal<IPermissionsOptions[]>
  permissionsSearch: Signal<IPermissionsOptions[]>
  roles: Signal<IRoleOption[]>
  searchPermissionsText: Signal<string | null>
}
