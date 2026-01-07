/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Signal, signal } from '@preact/signals-react'

import {
  EPermissionType,
  type IPermission,
  type IPermissionPagination,
  type IPermissionsState,
} from '@/interfaces'

const permissions: Signal<IPermission[]> = signal([])
const currentPermission: Signal<IPermission> = signal({})
const openDrawer: Signal<boolean> = signal(false)
const pagination: Signal<IPermissionPagination> = signal({
  data: [],
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 30, 50],
  total: 0,
})
const activeType: Signal<EPermissionType | null> = signal(EPermissionType.ROUTE)

export const PermissionsState: IPermissionsState = {
  activeType,
  currentPermission,
  openDrawer,
  pagination,
  permissions,
}
