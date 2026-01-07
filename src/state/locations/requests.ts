import type { AxiosResponse } from 'axios'

import axiosInstance, { buildApiUrl } from '@/axios'
import { type ILocation, type ILocationsGetAllResponse } from '@/interfaces'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

interface IGetListResponse {
  total: number
  limit: number
  page: number
  totalPages: number
  locations: ILocation[]
}

const LOCATION_BASE_URL = '/locations'

const locationsRequests = {
  createLocation: async (
    locationData: ILocation
  ): Promise<AxiosResponse<ILocation>> => {
    return await axiosInstance.post(
      buildApiUrl(LOCATION_BASE_URL),
      locationData,
      {
        headers: getTenantHeaders(),
      }
    )
  },
  deleteLocation: async (locationUId: string): Promise<AxiosResponse<void>> => {
    return await axiosInstance.delete(buildApiUrl(LOCATION_BASE_URL), {
      data: {
        uid: locationUId,
      },
      headers: getTenantHeaders(),
    })
  },
  getAll: async (
    search?: string
  ): Promise<AxiosResponse<ILocationsGetAllResponse>> => {
    const params = search ? { search } : {}
    return await axiosInstance.get(buildApiUrl(`${LOCATION_BASE_URL}/all`), {
      headers: getTenantHeaders(),
      params,
    })
  },
  getList: async ({
    limit,
    page,
  }: {
    limit: number
    page: number
  }): Promise<AxiosResponse<IGetListResponse>> => {
    return await axiosInstance.get(buildApiUrl(LOCATION_BASE_URL), {
      headers: getTenantHeaders(),
      params: {
        limit,
        page,
      },
    })
  },
  locationDetail: async (
    locationUId: string
  ): Promise<AxiosResponse<ILocation>> => {
    return await axiosInstance.post(
      buildApiUrl(`${LOCATION_BASE_URL}/detail`),
      {
        uid: locationUId,
      },
      { headers: getTenantHeaders() }
    )
  },
  updateLocation: async (
    locationData: ILocation
  ): Promise<AxiosResponse<ILocation>> => {
    return await axiosInstance.patch(
      buildApiUrl(LOCATION_BASE_URL),
      locationData,
      {
        headers: getTenantHeaders(),
      }
    )
  },
}

export default locationsRequests
