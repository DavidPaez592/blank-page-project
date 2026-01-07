import type { AxiosResponse } from 'axios'
import axiosInstance, { buildApiUrl } from '@/axios'
import { API_PREFIXES } from '@/config/api'
import type {
  IExchangeRate,
  IExchangeRateCreateRequest,
  IExchangeRateUpdateRequest,
  IExchangeRateDeleteRequest,
  IExchangeRatesGetAllResponse,
  IExchangeRatesPaginatedResponse,
  IExchangeRateCreateResponse,
  IExchangeRateUpdateResponse,
  IExchangeRateDeleteResponse,
  IExchangeRatePaginationOptions,
  IExchangeRateBulkUploadRequest,
  IExchangeRateBulkUploadResponse,
} from '@/interfaces'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

const EXCHANGE_RATE_BASE_URL = '/exchange-rates'

const exchangeRatesRequests = {
  getAll: async (filters: {
    date: string
    officeUId?: string
    currencyUId?: string
    paymentMethodUId?: string
  }): Promise<AxiosResponse<IExchangeRatesGetAllResponse>> => {
    const params = new URLSearchParams()
    params.append('date', filters.date)
    if (filters.officeUId) params.append('officeUId', filters.officeUId)
    if (filters.currencyUId) params.append('currencyUId', filters.currencyUId)
    if (filters.paymentMethodUId)
      params.append('paymentMethodUId', filters.paymentMethodUId)

    return await axiosInstance.get(
      buildApiUrl(`${EXCHANGE_RATE_BASE_URL}?${params.toString()}`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      {
        headers: getTenantHeaders(),
      }
    )
  },

  getPaginated: async (
    options: IExchangeRatePaginationOptions
  ): Promise<AxiosResponse<IExchangeRatesPaginatedResponse>> => {
    if (!options.date) {
      throw new Error('date is required for fetching exchange rates')
    }
    if (!options.officeUId) {
      throw new Error('officeUId is required for fetching exchange rates')
    }

    const requestData = {
      date: options.date,
      officeUId: options.officeUId,
      page: options.page || 1,
      limit: options.limit || 10,
      ...(options.currencyUId && { currencyUId: options.currencyUId }),
      ...(options.paymentMethodUId && {
        paymentMethodUId: options.paymentMethodUId,
      }),
    }

    return await axiosInstance.post(
      buildApiUrl(`${EXCHANGE_RATE_BASE_URL}/paginated`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      requestData,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  create: async (
    data: IExchangeRateCreateRequest
  ): Promise<AxiosResponse<IExchangeRateCreateResponse>> => {
    return await axiosInstance.post(
      buildApiUrl(EXCHANGE_RATE_BASE_URL, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  update: async (
    data: IExchangeRateUpdateRequest
  ): Promise<AxiosResponse<IExchangeRateUpdateResponse>> => {
    return await axiosInstance.put(
      buildApiUrl(EXCHANGE_RATE_BASE_URL, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  delete: async (
    data: IExchangeRateDeleteRequest
  ): Promise<AxiosResponse<IExchangeRateDeleteResponse>> => {
    return await axiosInstance.delete(
      buildApiUrl(`${EXCHANGE_RATE_BASE_URL}`, {
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

  bulkUpload: async (
    data: IExchangeRateBulkUploadRequest
  ): Promise<AxiosResponse<IExchangeRateBulkUploadResponse>> => {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('date', data.date)
    formData.append('officeUId', data.officeUId)

    return await axiosInstance.post(
      buildApiUrl(`${EXCHANGE_RATE_BASE_URL}/bulk-upload`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      formData,
      {
        headers: {
          ...getTenantHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },

  getById: async (uid: string): Promise<AxiosResponse<IExchangeRate>> => {
    return await axiosInstance.get(
      buildApiUrl(`${EXCHANGE_RATE_BASE_URL}/${uid}`, {
        prefix: API_PREFIXES.INVENTARIO,
      }),
      {
        headers: getTenantHeaders(),
      }
    )
  },
}

export default exchangeRatesRequests
