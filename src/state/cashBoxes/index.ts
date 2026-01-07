/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Signal, signal } from '@preact/signals-react'

import {
  type ICashBox,
  type IUser,
  type ICashBoxPagination,
  type ICashBoxesState,
} from '@/interfaces'

const cashBoxes: Signal<ICashBox[]> = signal([])
const currentCashBox: Signal<ICashBox | null> = signal(null)
const currentUser: Signal<IUser> = signal({})
const openDrawer: Signal<boolean> = signal(false)
const pagination: Signal<ICashBoxPagination> = signal({
  data: [],
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 30, 50],
  total: 0,
})
const currentPermissionsRoleUId: Signal<string | null> = signal(null)

export const CashBoxesState: ICashBoxesState = {
  cashBoxes,
  currentCashBox,
  currentUser,
  currentPermissionsRoleUId,
  openDrawer,
  pagination,
}
