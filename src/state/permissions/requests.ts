import type { AxiosResponse } from 'axios'

import axiosInstance, { buildApiUrl } from '@/axios'
import { EPermissionType, type IPermission } from '@/interfaces'

interface IGetListResponse {
  count: number
  limit: number
  page: number
  rows: IPermission[]
}
const PERMISSION_BASE_ROUTE = '/permissions'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

const permissionsRequests = {
  createPermission: async (
    permissionData: IPermission
  ): Promise<AxiosResponse<IPermission>> => {
    return await axiosInstance.post(
      buildApiUrl(`${PERMISSION_BASE_ROUTE}`),
      permissionData,
      { headers: getTenantHeaders() }
    )
  },
  deletePermission: async (
    permissionUId: string
  ): Promise<AxiosResponse<IPermission>> => {
    return await axiosInstance.delete(buildApiUrl(`${PERMISSION_BASE_ROUTE}`), {
      data: { uid: permissionUId },
      headers: getTenantHeaders(),
    })
  },
  getList: async ({
    limit,
    page,
    type,
  }: {
    limit: number
    page: number
    type: EPermissionType | null
  }): Promise<AxiosResponse<IGetListResponse>> => {
    const response = await axiosInstance.post(
      buildApiUrl(`${PERMISSION_BASE_ROUTE}/list`),
      {
        limit,
        page,
        type: type ?? EPermissionType.ROUTE,
      },
      { headers: getTenantHeaders() }
    )

    return {
      ...response,
      data: {
        ...response.data,
        rows: response.data.rows.map((permission: IPermission) => ({
          ...permission,
          key: permission.uid,
        })),
      },
    }
  },
  permissionDetail: async (
    permissionUId: string
  ): Promise<AxiosResponse<IPermission>> => {
    return await axiosInstance.post(
      buildApiUrl(`${PERMISSION_BASE_ROUTE}/detail`),
      { uid: permissionUId },
      { headers: getTenantHeaders() }
    )
  },
  updatePermission: async (
    permissionData: IPermission
  ): Promise<AxiosResponse<IPermission>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${PERMISSION_BASE_ROUTE}`),
      permissionData,
      { headers: getTenantHeaders() }
    )
  },
}

export default permissionsRequests
