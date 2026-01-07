import { type Signal, useSignal } from '@preact/signals-react'
import { useEffect } from 'react'

import { type ILocation } from '@/interfaces'
import { LocationsState, locationsSelectors } from '@/state/locations'
import { locationsStateActions } from '@/state/actions'

export const useLocations = () => {
  const loading = useSignal<{
    list: boolean
    create: boolean
    update: boolean
    delete: boolean
  }>({
    list: false,
    create: false,
    update: false,
    delete: false,
  })

  const loadLocationsList = async (): Promise<void> => {
    loading.value = { ...loading.peek(), list: true }
    try {
      await locationsStateActions.getLocationsList()
    } catch (error) {
    } finally {
      loading.value = { ...loading.peek(), list: false }
    }
  }

  useEffect(() => {
    loadLocationsList()
  }, [
    LocationsState.pagination.value.page,
    LocationsState.pagination.value.pageSize,
  ])

  const handleCreateLocation = async (
    locationData: ILocation
  ): Promise<boolean> => {
    loading.value = { ...loading.peek(), create: true }
    try {
      await locationsStateActions.createLocation(locationData)
      await loadLocationsList()
      return true
    } catch (error) {
      return false
    } finally {
      loading.value = { ...loading.peek(), create: false }
    }
  }

  const handleUpdateLocation = async (
    locationData: ILocation
  ): Promise<boolean> => {
    loading.value = { ...loading.peek(), update: true }
    try {
      await locationsStateActions.updateLocation(locationData)
      await loadLocationsList()
      return true
    } catch (error) {
      return false
    } finally {
      loading.value = { ...loading.peek(), update: false }
    }
  }

  const handleDeleteLocation = async (uid: string): Promise<boolean> => {
    loading.value = { ...loading.peek(), delete: true }
    try {
      await locationsStateActions.deleteLocation(uid)
      await loadLocationsList()
      return true
    } catch (error) {
      return false
    } finally {
      loading.value = { ...loading.peek(), delete: false }
    }
  }

  const handleEditLocation = async (uid: string) => {
    try {
      await locationsStateActions.editLocation(uid)
    } catch (error) {}
  }

  const handleAddLocation = () => {
    locationsStateActions.addLocation()
  }

  const handleCloseDrawer = () => {
    locationsStateActions.toggleOpenDrawer()
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    locationsStateActions.changePagination(page, pageSize)
  }

  const handleRefresh = async () => {
    await loadLocationsList()
  }

  return {
    locations: LocationsState.locations,
    pagination: LocationsState.pagination,
    currentLocation: LocationsState.currentLocation,
    openDrawer: LocationsState.openDrawer,
    loading,
    locationOptions: locationsSelectors.locationOptions,
    total: LocationsState.pagination.value.total,
    editMode: useSignal(Boolean(LocationsState.currentLocation.value.uid)),
    handleCreateLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    handleEditLocation,
    handleAddLocation,
    handleCloseDrawer,
    handlePaginationChange,
    handleRefresh,
    loadLocationsList,
  }
}

export const useGetAllLocations = (): {
  locations: Signal<ILocation[]>
  locationOptions: Signal<Array<{ label: string; value: string }>>
  loading: Signal<boolean>
} => {
  const loading = useSignal(false)

  useEffect(() => {
    const loadAllLocations = async () => {
      loading.value = true
      try {
        await locationsStateActions.getAllLocations()
      } catch (error) {
      } finally {
        loading.value = false
      }
    }

    loadAllLocations()
  }, [])

  return {
    locations: LocationsState.locations,
    locationOptions: locationsSelectors.locationOptions,
    loading,
  }
}
