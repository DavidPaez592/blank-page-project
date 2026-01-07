import type { AxiosResponse } from 'axios'
import axiosInstance, { buildApiUrl } from '@/axios'
import { API_PREFIXES } from '@/config/api'
import type {
  ICurrency,
  ICurrencyCreateRequest,
  ICurrencyUpdateRequest,
  ICurrencyDeleteRequest,
  ICurrenciesGetAllResponse,
  ICurrenciesPaginatedResponse,
  ICurrencyCreateResponse,
  ICurrencyUpdateResponse,
  ICurrencyDeleteResponse,
  ICurrencyPaginationOptions,
} from '@/interfaces'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

const CURRENCY_BASE_URL = '/currencies'

const currenciesRequests = {
  // Get all currencies
  getAll: async (): Promise<AxiosResponse<ICurrenciesGetAllResponse[]>> => {
    return await axiosInstance.get(
      buildApiUrl(`${CURRENCY_BASE_URL}/all`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      {
        headers: getTenantHeaders(),
      }
    )
  },

  // Get paginated currencies
  getPaginated: async (
    options?: ICurrencyPaginationOptions
  ): Promise<AxiosResponse<ICurrenciesPaginatedResponse>> => {
    const params = new URLSearchParams()

    if (options?.page) params.append('page', options.page.toString())
    if (options?.limit) params.append('limit', options.limit.toString())
    if (options?.filters?.name) params.append('name', options.filters.name)
    if (options?.filters?.code) params.append('code', options.filters.code)
    if (options?.filters?.search)
      params.append('search', options.filters.search)

    const queryString = params.toString()
    const url = queryString
      ? buildApiUrl(`${CURRENCY_BASE_URL}?${queryString}`, {
          prefix: API_PREFIXES.INVENTARIO,
        })
      : buildApiUrl(CURRENCY_BASE_URL, {
          prefix: API_PREFIXES.INVENTARIO,
        })

    return await axiosInstance.get(url, {
      headers: getTenantHeaders(),
    })
  },

  // Create new currency
  create: async (
    data: ICurrencyCreateRequest
  ): Promise<AxiosResponse<ICurrencyCreateResponse>> => {
    return await axiosInstance.post(
      buildApiUrl(CURRENCY_BASE_URL, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  // Update currency
  update: async (
    data: ICurrencyUpdateRequest
  ): Promise<AxiosResponse<ICurrencyUpdateResponse>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${CURRENCY_BASE_URL}`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  // Delete currency
  delete: async (
    data: ICurrencyDeleteRequest
  ): Promise<AxiosResponse<ICurrencyDeleteResponse>> => {
    return await axiosInstance.delete(
      buildApiUrl(`${CURRENCY_BASE_URL}`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      {
        headers: getTenantHeaders(),
        data: {
          uid: data.uid,
        },
      }
    )
  },

  // Get single currency by uid
  getById: async (uid: string): Promise<AxiosResponse<ICurrency>> => {
    return await axiosInstance.get(
      buildApiUrl(`${CURRENCY_BASE_URL}/${uid}`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      {
        headers: getTenantHeaders(),
      }
    )
  },
}

export default currenciesRequests
