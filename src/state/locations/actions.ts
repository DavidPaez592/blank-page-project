import { batch } from '@preact/signals-react'
import { message } from 'antd'

import { type ILocation } from '@/interfaces'
import { LocationsState } from '@/state/locations'

import appRequests from '../requests'

export const locationsStateActions = {
  addLocation: async () => {
    batch(() => {
      LocationsState.currentLocation.value = {
        deletable: true,
        modifiable: true,
      }
      LocationsState.openDrawer.value = true
    })
  },
  changePagination: (page: number, pageSize: number) => {
    LocationsState.pagination.value = {
      ...LocationsState.pagination.peek(),
      page,
      pageSize,
    }
  },
  createLocation: async (locationData: ILocation) => {
    try {
      await appRequests.Locations.createLocation(locationData)
      message.success('Ubicación creada exitosamente')
      LocationsState.openDrawer.value = false
    } catch (error) {
      throw error
    }
  },
  deleteLocation: async (locationUId: string) => {
    try {
      await appRequests.Locations.deleteLocation(locationUId)

      const currentPaginationData = LocationsState.pagination.peek()
      LocationsState.pagination.value = {
        ...currentPaginationData,
        data: [...currentPaginationData.data].filter(
          (item) => item.uid !== locationUId
        ),
        total: currentPaginationData.total - 1,
      }

      message.success('Ubicación eliminada exitosamente')
    } catch (error) {
      message.error('Error al eliminar la ubicación')
      throw error
    }
  },
  editLocation: async (locationUId: string) => {
    try {
      const [{ data: locationData }] = await Promise.all([
        appRequests.Locations.locationDetail(locationUId),
      ])

      batch(() => {
        locationsStateActions.setDetail(locationData)
        LocationsState.openDrawer.value = true
      })
    } catch (error) {
      message.error('Error al cargar los detalles de la ubicación')
      throw error
    }
  },
  getAllLocations: async (search?: string): Promise<void> => {
    try {
      const response = await appRequests.Locations.getAll(search)
      LocationsState.locations.value = response.data
    } catch (error) {
      message.error('Error al cargar las ubicaciones')
      throw error
    }
  },
  getDetail: async (
    locationUId: string,
    checkModifiable?: boolean,
    modifiableValue?: boolean
  ) => {
    try {
      const [{ data: locationData }] = await Promise.all([
        appRequests.Locations.locationDetail(locationUId),
      ])

      if (checkModifiable && locationData.modifiable !== modifiableValue) {
        throw new Error('Error getting location data')
      }

      batch(() => {
        locationsStateActions.setDetail(locationData)
      })
    } catch (error) {
      message.error('Error al cargar el detalle de la ubicación')
      throw error
    }
  },
  getLocationsList: async () => {
    try {
      const { page, pageSize } = LocationsState.pagination.peek()

      const [{ data: response }] = await Promise.all([
        appRequests.Locations.getList({
          limit: pageSize,
          page,
        }),
      ])

      LocationsState.pagination.value = {
        ...LocationsState.pagination.peek(),
        data: response.locations.map((location: ILocation) => ({
          ...location,
          key: location.uid,
        })),
        total: response.total,
        page: response.page,
        pageSize: response.limit,
      }
    } catch (error) {
      throw error
    }
  },
  setDetail: (locationData: ILocation) => {
    LocationsState.currentLocation.value = locationData
  },
  toggleOpenDrawer: () => {
    LocationsState.openDrawer.value = !LocationsState.openDrawer.peek()
  },
  updateLocation: async (locationData: ILocation) => {
    try {
      locationData.uid = LocationsState.currentLocation.peek().uid

      const { data: LocationResponse } =
        await appRequests.Locations.updateLocation(locationData)

      const currentPaginationData = LocationsState.pagination.peek()

      let currentLocationsData = [...currentPaginationData.data]

      currentLocationsData = currentLocationsData.map((item) => {
        if (item.uid === locationData.uid) return LocationResponse
        return item
      })

      batch(() => {
        LocationsState.pagination.value = {
          ...currentPaginationData,
          data: currentLocationsData,
        }

        LocationsState.currentLocation.value = {}
        LocationsState.openDrawer.value = false
      })

      message.success('Ubicación actualizada exitosamente')
    } catch (error) {
      message.error('Error al actualizar la ubicación')
      throw error
    }
  },
}
