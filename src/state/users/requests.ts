import type { AxiosResponse } from 'axios'

import axiosInstance, { buildApiUrl } from '@/axios'
import { type IUserFilters, type IUser } from '@/interfaces'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

interface IGetListResponse {
  count: number
  limit: number
  page: number
  rows: IUser[]
}

interface IGetListBoxesResponse {
  uid: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
const USER_BASE_URL = '/users'

const usersRequests = {
  assignPermissions: async ({
    permissions,
    roleUId,
    uid,
  }: {
    permissions: string[]
    roleUId: string
    uid: string
  }): Promise<AxiosResponse<{ assigned: boolean }>> => {
    return await axiosInstance.post(
      buildApiUrl(`${USER_BASE_URL}/assign-permissions`),
      {
        permissions,
        roleUId,
        uid,
      },
      { headers: getTenantHeaders() }
    )
  },
  createUser: async (userData: IUser): Promise<AxiosResponse<IUser>> => {
    return await axiosInstance.post(buildApiUrl(USER_BASE_URL), userData, {
      headers: getTenantHeaders(),
    })
  },
  deleteUser: async (userUId: string): Promise<AxiosResponse<IUser>> => {
    return await axiosInstance.delete(buildApiUrl(USER_BASE_URL), {
      data: { uid: userUId },
      headers: getTenantHeaders(),
    })
  },
  getList: async ({
    filters,
    limit,
    page,
  }: {
    filters: IUserFilters
    limit: number
    page: number
  }): Promise<AxiosResponse<IGetListResponse>> => {
    const response = await axiosInstance.post(
      buildApiUrl(`${USER_BASE_URL}/list`),
      {
        filters,
        limit,
        page,
      },
      { headers: getTenantHeaders() }
    )

    return {
      ...response,
      data: {
        ...response.data,
        rows: response.data.rows.map((user: IUser) => ({
          ...user,
          key: user.uid,
        })),
      },
    }
  },
  getPermissions: async ({
    roleId,
    userId,
  }: {
    roleId: number
    userId: number
  }): Promise<AxiosResponse<number[]>> => {
    return await axiosInstance.post(
      buildApiUrl(`${USER_BASE_URL}/permissions`),
      {
        id: userId,
        roleId,
      },
      { headers: getTenantHeaders() }
    )
  },
  updateUser: async (userData: IUser): Promise<AxiosResponse<IUser>> => {
    return await axiosInstance.patch(buildApiUrl(USER_BASE_URL), userData, {
      headers: getTenantHeaders(),
    })
  },
  userDetail: async (userUid: string): Promise<AxiosResponse<IUser>> => {
    return await axiosInstance.post(
      buildApiUrl(`${USER_BASE_URL}/detail`),
      { uid: userUid },
      { headers: getTenantHeaders() }
    )
  },
  assignTenant: async ({
    userUid,
    tenantUId,
    status,
  }: {
    userUid: string
    tenantUId: string
    status?: string
  }): Promise<AxiosResponse<{ assigned: boolean }>> => {
    return await axiosInstance.post(
      buildApiUrl(`${USER_BASE_URL}/tenant`),
      {
        uid: userUid,
        tenantUId,
        status,
      },
      { headers: getTenantHeaders() }
    )
  },
  updateTenantRelation: async ({
    userUid,
    tenantUId,
  }: {
    userUid: string
    tenantUId: string
  }): Promise<AxiosResponse<{ updated: boolean }>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${USER_BASE_URL}/tenant`),
      {
        uid: userUid,
        tenantUId,
      },
      { headers: getTenantHeaders() }
    )
  },
  removeTenant: async ({
    userUid,
    tenantUId,
  }: {
    userUid: string
    tenantUId: string
  }): Promise<AxiosResponse<{ removed: boolean }>> => {
    return await axiosInstance.delete(buildApiUrl(`${USER_BASE_URL}/tenant`), {
      data: {
        uid: userUid,
        tenantUId,
      },
      headers: getTenantHeaders(),
    })
  },
  getUserCashBoxes: async (
    userUId: string
  ): Promise<AxiosResponse<IGetListBoxesResponse[]>> => {
    return await axiosInstance.post(
      buildApiUrl(`${USER_BASE_URL}/cashboxes/list`),
      { uid: userUId },
      { headers: getTenantHeaders() }
    )
  },
}

export default usersRequests
