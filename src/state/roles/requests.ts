import type { AxiosResponse } from 'axios'

import axiosInstance, { buildApiUrl } from '@/axios'
import { type IPermission, type IRole } from '@/interfaces'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

interface IGetListResponse {
  count: number
  limit: number
  page: number
  rows: IRole[]
}
const ROLE_BASE_ROLE = '/roles'

const rolesRequests = {
  assignPermissions: async ({
    permissions,
    roleUId: roleUid,
  }: {
    permissions: string[]
    roleUId: string
  }): Promise<AxiosResponse<{ assigned: boolean }>> => {
    return await axiosInstance.post(
      buildApiUrl(`${ROLE_BASE_ROLE}/assign-permissions`),
      {
        permissions,
        uid: roleUid,
      },
      { headers: getTenantHeaders() }
    )
  },
  createRole: async (roleData: IRole): Promise<AxiosResponse<IRole>> => {
    return await axiosInstance.post(
      buildApiUrl(`${ROLE_BASE_ROLE}`),
      roleData,
      {
        headers: getTenantHeaders(),
      }
    )
  },
  deleteRole: async (roleUId: string): Promise<AxiosResponse<IRole>> => {
    return await axiosInstance.delete(buildApiUrl(`${ROLE_BASE_ROLE}`), {
      data: {
        uid: roleUId,
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
    return await axiosInstance.post(
      buildApiUrl(`${ROLE_BASE_ROLE}/list`),
      {
        limit,
        page,
      },
      { headers: getTenantHeaders() }
    )
  },
  getPermissions: async (
    roleUid: string
  ): Promise<AxiosResponse<IPermission[]>> => {
    return await axiosInstance.post(
      buildApiUrl(`${ROLE_BASE_ROLE}/permissions`),
      {
        uid: roleUid,
      },
      { headers: getTenantHeaders() }
    )
  },
  roleDetail: async (roleUId: string): Promise<AxiosResponse<IRole>> => {
    return await axiosInstance.post(
      buildApiUrl(`${ROLE_BASE_ROLE}/detail`),
      {
        uid: roleUId,
      },
      { headers: getTenantHeaders() }
    )
  },
  setDefault: async (roleUid: string): Promise<AxiosResponse<IRole>> => {
    return await axiosInstance.post(
      buildApiUrl(`${ROLE_BASE_ROLE}/set-default`),
      {
        uid: roleUid,
      },
      { headers: getTenantHeaders() }
    )
  },
  updateRole: async (roleData: IRole): Promise<AxiosResponse<IRole>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${ROLE_BASE_ROLE}`),
      roleData,
      {
        headers: getTenantHeaders(),
      }
    )
  },
}

export default rolesRequests
