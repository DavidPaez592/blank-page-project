import { type Signal } from '@preact/signals-react'

import type { IPagination, ModelBase } from './common'

export interface ILocation extends ModelBase {
  code?: string
  name?: string
  address?: string
  cityUId?: string
  city?: {
    uid?: string
    name?: string
    dianCode?: string
    departmentName?: string
  }
  additionalDetails?: string | null
  deletable?: boolean | null
  modifiable?: boolean | null
}

export interface ILocationPagination extends IPagination {
  data: ILocation[]
}

export interface ILocationsState {
  currentLocation: Signal<ILocation>
  openDrawer: Signal<boolean>
  pagination: Signal<ILocationPagination>
  locations: Signal<ILocation[]>
}

export interface ILocationOption {
  label: string
  value: string
}

export interface ILocationsGetAllResponse extends Array<ILocation> {}
