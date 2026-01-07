import type { AxiosResponse } from 'axios'

import axiosInstance, { buildApiUrl } from '@/axios'
import { type IRoute } from '@/interfaces'

interface IGetListResponse {
  count: number
  limit: number
  page: number
  rows: IRoute[]
}
const ROUTE_BASE_ROUTE = '/routes'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

const routesRequests = {
  createRoute: async (routeData: IRoute): Promise<AxiosResponse<IRoute>> => {
    return await axiosInstance.post(
      buildApiUrl(`${ROUTE_BASE_ROUTE}`),
      routeData,
      {
        headers: getTenantHeaders(),
      }
    )
  },
  deleteRoute: async (routeUId: string): Promise<AxiosResponse<IRoute>> => {
    return await axiosInstance.delete(buildApiUrl(`${ROUTE_BASE_ROUTE}`), {
      data: {
        uid: routeUId,
      },
      headers: getTenantHeaders(),
    })
  },
  getList: async ({
    limit,
    page,
  }: {
    limit: number
    page: number
  }): Promise<AxiosResponse<IGetListResponse>> => {
    const response = await axiosInstance.post(
      buildApiUrl(`${ROUTE_BASE_ROUTE}/list`),
      {
        limit,
        page,
      },
      { headers: getTenantHeaders() }
    )

    return {
      ...response,
      data: {
        ...response.data,
        rows: response.data.rows.map((route: IRoute) => ({
          ...route,
          key: route.uid,
        })),
      },
    }
  },
  routeDetail: async (routeUId: string): Promise<AxiosResponse<IRoute>> => {
    return await axiosInstance.post(
      buildApiUrl(`${ROUTE_BASE_ROUTE}/detail`),
      {
        uid: routeUId,
      },
      { headers: getTenantHeaders() }
    )
  },
  updateRoute: async (routeData: IRoute): Promise<AxiosResponse<IRoute>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${ROUTE_BASE_ROUTE}`),
      routeData,
      {
        headers: getTenantHeaders(),
      }
    )
  },
}

export default routesRequests
