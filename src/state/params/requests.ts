import type { AxiosResponse } from 'axios'

import axiosInstance, { buildApiUrl } from '@/axios'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}
import type {
  IIdentificationType,
  IMenuItem,
  IPermission,
  IRole,
} from '@/interfaces'

const paramsRequests = {
  getAllMenuItems: async (): Promise<AxiosResponse<IMenuItem[]>> => {
    return await axiosInstance.get(buildApiUrl('/menu-items/all'), {
      headers: getTenantHeaders(),
    })
  },
  getAllPermissions: async ({
    text = null,
  }: {
    text: string | null
  }): Promise<AxiosResponse<IPermission[]>> => {
    return await axiosInstance.post(
      buildApiUrl('/permissions/all'),
      { text: text ?? null },
      { headers: getTenantHeaders() }
    )
  },
  getAllRoles: async (): Promise<AxiosResponse<IRole[]>> => {
    return await axiosInstance.get(buildApiUrl('/roles/all'), {
      headers: getTenantHeaders(),
    })
  },
  getMenuItemsParents: async (): Promise<AxiosResponse<IMenuItem[]>> => {
    return await axiosInstance.get(buildApiUrl('/menu-items/all-parent'), {
      headers: getTenantHeaders(),
    })
  },
  paramsIdTypes: async (): Promise<AxiosResponse<IIdentificationType[]>> => {
    return await axiosInstance.get(buildApiUrl('/id-types/all'), {
      headers: getTenantHeaders(),
    })
  },
}

export default paramsRequests
