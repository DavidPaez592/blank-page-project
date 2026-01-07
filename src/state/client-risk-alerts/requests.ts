import type { AxiosResponse } from 'axios'
import axiosInstance, { buildApiUrl } from '@/axios'
import type {
  IClientRiskAlert,
  IClientRiskAlertCreateRequest,
  IClientRiskAlertUpdateRequest,
  IClientRiskAlertDeleteRequest,
  IClientRiskAlertDetailRequest,
  IClientRiskAlertListResponse,
  IClientRiskAlertCreateResponse,
  IClientRiskAlertUpdateResponse,
  IClientRiskAlertDeleteResponse,
  IClientRiskAlertGetAllResponse,
  IClientRiskAlertListOptions,
  IClientRiskAlertGetAllOptions,
} from '@/interfaces/client-risk-alerts'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  console.log('DEBUG: tenant_uid from sessionStorage:', tenantUid)

  if (!tenantUid) {
    console.error('ERROR: No tenant_uid found in sessionStorage!')
    // Try to get it from other possible locations
    console.log('All sessionStorage keys:', Object.keys(sessionStorage))
  }

  const headers = tenantUid ? { 'x-tenant-uid': tenantUid } : {}
  console.log('DEBUG: headers being sent:', headers)
  return headers
}

const CLIENT_RISK_ALERTS_BASE_URL = '/client-risk-alerts'

const clientRiskAlertsRequests = {
  /**
   * Get paginated list of client risk alerts
   */
  list: (
    options?: IClientRiskAlertListOptions
  ): Promise<AxiosResponse<IClientRiskAlertListResponse>> => {
    const params = new URLSearchParams()

    if (options?.limit) params.append('limit', options.limit.toString())
    if (options?.page) params.append('page', options.page.toString())
    if (options?.status) params.append('status', options.status)
    if (options?.clientUId) params.append('clientUId', options.clientUId)

    const queryString = params.toString()
    const url = queryString
      ? buildApiUrl(`${CLIENT_RISK_ALERTS_BASE_URL}?${queryString}`)
      : buildApiUrl(CLIENT_RISK_ALERTS_BASE_URL)

    return axiosInstance.get(url, {
      headers: getTenantHeaders(),
    })
  },

  /**
   * Get all client risk alerts without pagination
   */
  getAll: (
    options?: IClientRiskAlertGetAllOptions
  ): Promise<AxiosResponse<IClientRiskAlertGetAllResponse>> => {
    const params = new URLSearchParams()

    if (options?.status) params.append('status', options.status)
    if (options?.search) params.append('search', options.search)

    const queryString = params.toString()
    const url = queryString
      ? buildApiUrl(`${CLIENT_RISK_ALERTS_BASE_URL}/all?${queryString}`)
      : buildApiUrl(`${CLIENT_RISK_ALERTS_BASE_URL}/all`)

    return axiosInstance.get(url, {
      headers: getTenantHeaders(),
    })
  },

  /**
   * Get client risk alert details
   */
  getDetail: (
    data: IClientRiskAlertDetailRequest
  ): Promise<AxiosResponse<IClientRiskAlert>> => {
    return axiosInstance.post(
      buildApiUrl(`${CLIENT_RISK_ALERTS_BASE_URL}/detail`),
      data,
      {
        headers: getTenantHeaders(),
      }
    )
  },

  /**
   * Create new client risk alert
   */
  create: (
    data: IClientRiskAlertCreateRequest
  ): Promise<AxiosResponse<IClientRiskAlertCreateResponse>> => {
    return axiosInstance.post(buildApiUrl(CLIENT_RISK_ALERTS_BASE_URL), data, {
      headers: getTenantHeaders(),
    })
  },

  /**
   * Update existing client risk alert
   */
  update: (
    data: IClientRiskAlertUpdateRequest
  ): Promise<AxiosResponse<IClientRiskAlertUpdateResponse>> => {
    return axiosInstance.patch(buildApiUrl(CLIENT_RISK_ALERTS_BASE_URL), data, {
      headers: getTenantHeaders(),
    })
  },

  /**
   * Delete client risk alert
   */
  delete: (
    data: IClientRiskAlertDeleteRequest
  ): Promise<AxiosResponse<IClientRiskAlertDeleteResponse>> => {
    return axiosInstance.delete(buildApiUrl(CLIENT_RISK_ALERTS_BASE_URL), {
      data,
      headers: getTenantHeaders(),
    })
  },
}

export default clientRiskAlertsRequests
