import { type Signal } from '@preact/signals-react'

import type { IPagination, ModelBase } from './common'
import { ETenantStatus } from './enums'
import { IUser } from './user'

export interface ICashBox extends ModelBase {
  name: string
  createdAt?: string
  updatedAt?: string
  uid: string
  isActive?: boolean
}

export interface ICashBoxPagination extends IPagination {
  data: ICashBox[]
}

export interface ICashBoxesState {
  currentCashBox: Signal<ICashBox | null>
  openDrawer: Signal<boolean>
  currentUser: Signal<IUser>
  currentPermissionsRoleUId: Signal<string | null>
  pagination: Signal<ICashBoxPagination>
  cashBoxes: Signal<ICashBox[]>
}

export interface ICashBoxOption {
  label: string
  value: string
}
