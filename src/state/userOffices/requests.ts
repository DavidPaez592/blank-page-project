import type { AxiosResponse } from 'axios'
import axiosInstance, { buildApiUrl } from '@/axios'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

export interface IAssignOfficeToUserParams {
  uid: string
  officeUId: string
}

export interface IRemoveOfficeFromUserParams {
  uid: string
  officeUId: string
}

export interface IListUserOfficesParams {
  uid: string
}

export interface IUserOfficeResponse {
  uid: string
  name: string
  code?: string
  assignedAt?: string
}

export interface IOfficeResponse {
  uid: string
  name: string
  code?: string
}

export interface IListUserOfficesResponse extends Array<IUserOfficeResponse> {}

export interface IListOfficesResponse {
  data: IOfficeResponse[]
}

const userOfficesRequests = {
  listAllOffices: (): Promise<AxiosResponse<IOfficeResponse[]>> => {
    return axiosInstance.get(buildApiUrl('/offices/all'), {
      headers: getTenantHeaders(),
    })
  },

  listUserOffices: (
    params: IListUserOfficesParams
  ): Promise<AxiosResponse<IListUserOfficesResponse>> => {
    return axiosInstance.post(buildApiUrl('/users/offices/list'), params, {
      headers: getTenantHeaders(),
    })
  },

  assignOfficeToUser: (
    params: IAssignOfficeToUserParams
  ): Promise<AxiosResponse<any>> => {
    return axiosInstance.post(buildApiUrl('/users/offices/add'), params, {
      headers: getTenantHeaders(),
    })
  },

  removeOfficeFromUser: (
    params: IRemoveOfficeFromUserParams
  ): Promise<AxiosResponse<any>> => {
    return axiosInstance.delete(buildApiUrl('/users/offices/remove'), {
      data: params,
      headers: getTenantHeaders(),
    })
  },
}

export default userOfficesRequests
