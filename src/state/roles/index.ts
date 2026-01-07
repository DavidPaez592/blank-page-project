/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Signal, signal } from '@preact/signals-react'

import {
  type IRole,
  type IRolePagination,
  type IRolesState,
} from '@/interfaces'

const roles: Signal<IRole[]> = signal([])
const permissions: Signal<string[]> = signal([])
const currentRole: Signal<IRole> = signal({})
const openDrawer: Signal<boolean> = signal(false)
const pagination: Signal<IRolePagination> = signal({
  data: [],
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 30, 50],
  total: 0,
})
const openPermissionsDrawer: Signal<boolean> = signal(false)

export const RolesState: IRolesState = {
  currentRole,
  openDrawer,
  openPermissionsDrawer,
  pagination,
  permissions,
  roles,
}
