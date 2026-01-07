/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type Signal, signal } from '@preact/signals-react'

import {
  type ITenant,
  type ITenantPagination,
  type ITenantsState,
} from '@/interfaces'

const tenants: Signal<ITenant[]> = signal([])
const currentTenant: Signal<ITenant> = signal({})
const openDrawer: Signal<boolean> = signal(false)
const pagination: Signal<ITenantPagination> = signal({
  data: [],
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 30, 50],
  total: 0,
})

export const TenantsState: ITenantsState = {
  currentTenant,
  openDrawer,
  pagination,
  tenants,
}
