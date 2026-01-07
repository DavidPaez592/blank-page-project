import { type Signal, signal, computed } from '@preact/signals-react'

import {
  type ILocation,
  type ILocationPagination,
  type ILocationsState,
} from '@/interfaces'

const locations: Signal<ILocation[]> = signal([])
const currentLocation: Signal<ILocation> = signal({})
const openDrawer: Signal<boolean> = signal(false)
const pagination: Signal<ILocationPagination> = signal({
  data: [],
  page: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 30, 50],
  total: 0,
})

export const LocationsState: ILocationsState = {
  currentLocation,
  openDrawer,
  pagination,
  locations,
}

export const locationsSelectors = {
  locationOptions: computed(() =>
    LocationsState.locations.value?.map((location) => ({
      label: location.name ?? '',
      value: location.uid ?? '',
    }))
  ),
}
