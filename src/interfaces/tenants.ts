import { type Signal } from '@preact/signals-react'

import type { IPagination, ModelBase } from './common'
import { ETenantStatus } from './enums'

export interface ITenant extends ModelBase {
  name?: string
  status?: ETenantStatus
}

export interface ITenantPagination extends IPagination {
  data: ITenant[]
}

export interface ITenantsState {
  currentTenant: Signal<ITenant>
  openDrawer: Signal<boolean>
  pagination: Signal<ITenantPagination>
  tenants: Signal<ITenant[]>
}

export interface ITenantOption {
  label: string
  value: string
}
