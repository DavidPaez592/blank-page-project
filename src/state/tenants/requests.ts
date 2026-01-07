import type { AxiosResponse } from 'axios'

import axiosInstance, { buildApiUrl } from '@/axios'
import { type ITenant, type IUser, type IRole } from '@/interfaces'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

interface IGetListResponse {
  count: number
  limit: number
  page: number
  tenants: ITenant[]
}

interface ITenantUsersResponse {
  users: IUser[]
}

interface IAddUserToTenantRequest {
  tenantUId: string
  firstName?: string
  firstSurname?: string
  secondName?: string
  secondSurname?: string
  email?: string
  identificationTypeUId?: string
  identificationNumber?: string
  roleUIds?: string[]
}

interface IUpdateUserInTenantRequest {
  tenantUId: string
  userUId: string
  status: string
  roleUIds?: string[]
  firstName?: string
  firstSurname?: string
  secondName?: string
  secondSurname?: string
  email?: string
}

interface ITenantRolesPaginatedResponse {
  count: number
  limit: number
  page: number
  roles: IRole[]
}

// Offices
interface IOffice {
  uid: string
  name: string
  createdAt?: string
  updatedAt?: string
}

interface IListOfficesResponse {
  page: number
  limit: number
  offices: IOffice[]
  total: number
  totalPages: number
}

const TENANT_BASE_URL = '/tenants'

const USERS_BASE_URL = '/users'

const tenantsRequests = {
  createTenant: async (
    tenantData: ITenant
  ): Promise<AxiosResponse<ITenant>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}`),
      tenantData,
      {
        headers: getTenantHeaders(),
      }
    )
  },
  deleteTenant: async (tenantUId: string): Promise<AxiosResponse<ITenant>> => {
    return await axiosInstance.delete(buildApiUrl(`${TENANT_BASE_URL}`), {
      data: {
        uid: tenantUId,
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
    return await axiosInstance.get(buildApiUrl(`${TENANT_BASE_URL}`), {
      params: {
        limit,
        page,
      },
      headers: getTenantHeaders(),
    })
  },
  tenantDetail: async (tenantUId: string): Promise<AxiosResponse<ITenant>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/detail`),
      {
        uid: tenantUId,
      },
      { headers: getTenantHeaders() }
    )
  },
  updateTenant: async (
    tenantData: ITenant
  ): Promise<AxiosResponse<ITenant>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${TENANT_BASE_URL}`),
      tenantData,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  getTenantUsers: async (
    tenantUid: string
  ): Promise<AxiosResponse<ITenantUsersResponse>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/users`),
      {
        uid: tenantUid,
      },
      { headers: getTenantHeaders() }
    )
  },

  getTenantRoles: async (
    tenantUid: string
  ): Promise<AxiosResponse<IRole[]>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/roles`),
      {
        uid: tenantUid,
      },
      { headers: getTenantHeaders() }
    )
  },

  getTenantRolesPaginated: async (data: {
    uid: string
    page: number
    limit: number
  }): Promise<AxiosResponse<{ roles: IRole[]; total: number }>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/roles/paginated`),
      data,
      { headers: getTenantHeaders() }
    )
  },

  addRoleToTenant: async (data: {
    uid: string
    name: string
    description: string
    modifiable?: boolean
    deletable?: boolean
  }): Promise<AxiosResponse<{ message: string; role: IRole }>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/roles/add`),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  updateTenantRole: async (data: {
    tenantUId: string
    roleUId: string
    name: string
    description: string
    modifiable?: boolean
    deletable?: boolean
  }): Promise<AxiosResponse<{ message: string; role: IRole }>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${TENANT_BASE_URL}/roles/update`),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  deleteTenantRole: async (data: {
    tenantUId: string
    roleUId: string
  }): Promise<AxiosResponse<{ message: string }>> => {
    return await axiosInstance.delete(
      buildApiUrl(`${TENANT_BASE_URL}/roles/delete`),
      {
        data,
        headers: getTenantHeaders(),
      }
    )
  },

  addUserToTenant: async (
    data: IAddUserToTenantRequest
  ): Promise<AxiosResponse<{ message: string }>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/add-user`),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  updateUserInTenant: async (
    data: IUpdateUserInTenantRequest
  ): Promise<AxiosResponse<{ message: string }>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${TENANT_BASE_URL}/update-user`),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  assignRolePermissions: async (data: {
    tenantUId: string
    roleUId: string
    permissions: string[]
  }): Promise<AxiosResponse<{ message: string }>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/roles/assign-permissions`),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  getRolePermissions: async (data: {
    tenantUId: string
    roleUId: string
  }): Promise<AxiosResponse<string[]>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/roles/permissions`),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  // Offices basic endpoints (only create + list for now)
  createOffice: async (data: {
    tenantUId: string
    name: string
  }): Promise<AxiosResponse<IOffice>> => {
    return await axiosInstance.post(
      buildApiUrl(`/offices`),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  listOffices: async (data: {
    tenantUId: string
    page?: number
    limit?: number
  }): Promise<AxiosResponse<IListOfficesResponse>> => {
    
    return await axiosInstance.get(buildApiUrl(`/offices`), {
      params: {
        uid: data.tenantUId,
        page: data.page ?? 1,
        limit: data.limit ?? 10,
      },
      headers: getTenantHeaders(),
    })
  },
  // Devuelve un array plano de oficinas (el backend actualmente responde con un array directo)
  listAllOffices: async (data: {
    tenantUId: string //Este campo es la uid del usuario
    userUId?:string //Este campo es la uid del usuario
  }): Promise<AxiosResponse<IOffice[]>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/offices/all`),
      { tenantUId: data.tenantUId }, 
      { headers: getTenantHeaders() }
    )
  },
  updateOffice: async (data: {
    tenantUId: string
    officeUId: string
    name: string
  }): Promise<AxiosResponse<{ office: IOffice; message: string }>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${TENANT_BASE_URL}/offices/update`),
      { tenantUId: data.tenantUId, officeUId: data.officeUId, name: data.name },
      { headers: getTenantHeaders() }
    )
  },
  deleteOffice: async (data: {
    tenantUId: string
    officeUId: string
  }): Promise<AxiosResponse<{ message: string }>> => {
    return await axiosInstance.delete(
      buildApiUrl(`${TENANT_BASE_URL}/offices/delete`),
      {
        data: { tenantUId: data.tenantUId, officeUId: data.officeUId },
        headers: getTenantHeaders(),
      }
    )
  },
  assignUserToOffice: async (data: {
    tenantUId: string
    userUId: string
    officeUId: string
  }): Promise<AxiosResponse<{ message: string }>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/users/offices/add`),
      data,
      { headers: getTenantHeaders() }
    )
  },
  removeUserFromOffice: async (data: {
    tenantUId: string
    userUId: string
    officeUId: string
  }): Promise<AxiosResponse<{ message: string }>> => {
    return await axiosInstance.delete(
      buildApiUrl(`${TENANT_BASE_URL}/users/offices/remove`),
      { data, headers: getTenantHeaders() }
    )
  },
  // El backend puede devolver:
  // { statusCode, success, message, data: [ { uid, name, assignedAt } ] }
  // o { statusCode, success, message, data: { offices: [...], total } }
  listUserOffices: async (data: {
    tenantUId: string
    userUId: string
  }): Promise<AxiosResponse<any>> => {
    return await axiosInstance.get(
      buildApiUrl(`/offices/all`),
      { params: data, headers: getTenantHeaders() }
    )
  },
  // Global offices (no tenant header usage might still send header just in case)
  listAllOfficesGlobal: async (): Promise<AxiosResponse<IOffice[]>> => {
    return await axiosInstance.get(buildApiUrl(`/offices/all`), {
      headers: getTenantHeaders(),
    })
  },
  // Assign office to user (global endpoint)
  assignTenantOfficeToUser: async (data: {
    tenantUId: string
    userUId: string
    officeUId: string
  }): Promise<AxiosResponse<{ message: string }>> => {
    return await axiosInstance.post(
      buildApiUrl(`${TENANT_BASE_URL}/users/offices/add`),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },
  removeCashBoxUser: async (data: {
    uid: string
    cashboxUId: string
  }): Promise<AxiosResponse<{ message: string }>> => {
    return await axiosInstance.delete(
      buildApiUrl(`${USERS_BASE_URL}/cashboxes/remove`), //--------------------------->>>>>>>>>>>>>>>>>
      {
        data,
        headers: getTenantHeaders(),
      }
    )
  },
  listUserOfficesGlobal: async (data: {
    uid: string
  }): Promise<AxiosResponse<any>> => {
    return await axiosInstance.post(buildApiUrl('/users/offices/list'), data, {
      headers: getTenantHeaders(),
    })
  },
}

export default tenantsRequests
