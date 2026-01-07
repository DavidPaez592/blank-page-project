import type { AxiosResponse } from 'axios'
import axiosInstance, { buildApiUrl } from '@/axios'
import type { IOfficesGetAllResponse } from '@/interfaces'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

const OFFICE_BASE_URL = '/offices'

const officesRequests = {
  getAll: async (): Promise<AxiosResponse<IOfficesGetAllResponse>> => {
    return await axiosInstance.get(buildApiUrl(`${OFFICE_BASE_URL}/all`), {
      headers: getTenantHeaders(),
    })
  },
}

export default officesRequests
