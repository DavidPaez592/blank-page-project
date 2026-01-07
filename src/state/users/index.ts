/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Signal, signal } from '@preact/signals-react'

import {
  type IUserFilters,
  type IUser,
  type IUserPagination,
  type IUsersState,
  ICashBox,
} from '@/interfaces'

const users: Signal<IUser[]> = signal([])
const permissions: Signal<string[]> = signal([])
const currentUser: Signal<IUser> = signal({})
const openDrawer: Signal<boolean> = signal(false)
const pagination: Signal<IUserPagination> = signal({
  data: [],
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 30, 50],
  total: 0,
})
const filters: Signal<IUserFilters> = signal({ text: null })
const openPermissionsDrawer: Signal<boolean> = signal(false)
const openTenantsDrawer: Signal<boolean> = signal(false)
const selectedUserTenants: Signal<string[]> = signal([])
const currentPermissionsRoleUId: Signal<string | null> = signal(null)
const userCashBoxes: Signal<ICashBox[]> = signal([])
const openCashBoxesDrawer: Signal<boolean> = signal(false)

export const UsersState: IUsersState = {
  currentPermissionsRoleUId,
  currentUser,
  filters,
  openDrawer,
  openPermissionsDrawer,
  openTenantsDrawer,
  pagination,
  permissions,
  selectedUserTenants,
  users,
  userCashBoxes,
  openCashBoxesDrawer,
}
