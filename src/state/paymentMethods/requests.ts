import type { AxiosResponse } from 'axios'
import axiosInstance, { buildApiUrl } from '@/axios'
import { API_PREFIXES } from '@/config/api'
import type {
  IPaymentMethod,
  IPaymentMethodCreateRequest,
  IPaymentMethodUpdateRequest,
  IPaymentMethodDeleteRequest,
  IPaymentMethodsGetAllResponse,
  IPaymentMethodsPaginatedResponse,
  IPaymentMethodCreateResponse,
  IPaymentMethodUpdateResponse,
  IPaymentMethodDeleteResponse,
  IPaymentMethodPaginationOptions,
} from '@/interfaces'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

const PAYMENT_METHOD_BASE_URL = '/payment-methods'

const paymentMethodsRequests = {
  // Get all payment methods
  getAll: async (): Promise<AxiosResponse<IPaymentMethodsGetAllResponse[]>> => {
    return await axiosInstance.get(
      buildApiUrl(`${PAYMENT_METHOD_BASE_URL}/all`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      {
        headers: getTenantHeaders(),
      }
    )
  },

  // Get paginated payment methods
  getPaginated: async (
    options?: IPaymentMethodPaginationOptions
  ): Promise<AxiosResponse<IPaymentMethodsPaginatedResponse>> => {
    const params = new URLSearchParams()

    if (options?.page) params.append('page', options.page.toString())
    if (options?.limit) params.append('limit', options.limit.toString())
    if (options?.filters?.name) params.append('name', options.filters.name)
    if (options?.filters?.search)
      params.append('search', options.filters.search)

    const queryString = params.toString()
    const url = queryString
      ? buildApiUrl(`${PAYMENT_METHOD_BASE_URL}?${queryString}`, {
          prefix: API_PREFIXES.INVENTARIO,
        })
      : buildApiUrl(PAYMENT_METHOD_BASE_URL, {
          prefix: API_PREFIXES.INVENTARIO,
        })

    return await axiosInstance.get(url, {
      headers: getTenantHeaders(),
    })
  },

  // Create new payment method
  create: async (
    data: IPaymentMethodCreateRequest
  ): Promise<AxiosResponse<IPaymentMethodCreateResponse>> => {
    return await axiosInstance.post(
      buildApiUrl(PAYMENT_METHOD_BASE_URL, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  // Update payment method
  update: async (
    data: IPaymentMethodUpdateRequest
  ): Promise<AxiosResponse<IPaymentMethodUpdateResponse>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${PAYMENT_METHOD_BASE_URL}`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  // Delete payment method
  delete: async (
    data: IPaymentMethodDeleteRequest
  ): Promise<AxiosResponse<IPaymentMethodDeleteResponse>> => {
    return await axiosInstance.delete(
      buildApiUrl(`${PAYMENT_METHOD_BASE_URL}`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      {
        data,
        headers: getTenantHeaders(),
      }
    )
  },

  // Get single payment method by uid
  getById: async (uid: string): Promise<AxiosResponse<IPaymentMethod>> => {
    return await axiosInstance.get(
      buildApiUrl(`${PAYMENT_METHOD_BASE_URL}/${uid}`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      {
        headers: getTenantHeaders(),
      }
    )
  },
}

export default paymentMethodsRequests
