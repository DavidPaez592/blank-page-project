import type { AxiosResponse } from 'axios'

import axiosInstance, { buildApiUrl } from '@/axios'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

export const menuItemsRequests = {
  getList: async ({
    limit,
    page,
  }: {
    limit: number
    page: number
  }): Promise<AxiosResponse> => {
    return await axiosInstance.post(
      buildApiUrl('menu-items/list'),
      {
        limit,
        page,
      },
      { headers: getTenantHeaders() }
    )
  },
}
