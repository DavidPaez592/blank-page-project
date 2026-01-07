/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Signal, signal } from '@preact/signals-react'

import { PERMISSION_TYPES_OPTIONS } from '@/constants'
import {
  type IRoleOption,
  type IPermissionTypesOptions,
  type IIdentificationType,
  type IParamsState,
  type IMenuItemsOptions,
  type IPermissionsOptions,
  type IAssignPermissionsOption,
} from '@/interfaces'

const docTypes: Signal<IIdentificationType[]> = signal([])
const permissionTypes: Signal<IPermissionTypesOptions[]> = signal(
  PERMISSION_TYPES_OPTIONS
)
const menuItems: Signal<IMenuItemsOptions[]> = signal([])
const permissions: Signal<IPermissionsOptions[]> = signal([])
const assignPermissions: Signal<IAssignPermissionsOption[]> = signal([])
const permissionsSearch: Signal<IPermissionsOptions[]> = signal([])
const searchPermissionsText: Signal<string | null> = signal(null)
const roles: Signal<IRoleOption[]> = signal([])

export const ParamsState: IParamsState = {
  assignPermissions,
  docTypes,
  menuItems,
  permissionTypes,
  permissions,
  permissionsSearch,
  roles,
  searchPermissionsText,
}
