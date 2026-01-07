import type { AxiosResponse } from 'axios'
import axiosInstance, { buildApiUrl } from '@/axios'
import type {
  IClient,
  IClientCreateRequest,
  IClientFindRequest,
  IClientCreateResponse,
  IClientFindResponse,
} from '@/interfaces/clients'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

const clientsRequests = {
  /**
   * Crear un nuevo cliente
   */
  createClient: (
    data: IClientCreateRequest
  ): Promise<AxiosResponse<IClientCreateResponse>> => {
    return axiosInstance.post(buildApiUrl('/clients'), data, {
      headers: getTenantHeaders(),
    })
  },

  /**
   * Actualizar un cliente existente
   */
  updateClient: (
    uid: string,
    data: IClientCreateRequest
  ): Promise<AxiosResponse<IClientCreateResponse>> => {
    return axiosInstance.patch(
      buildApiUrl('/clients'),
      { ...data, clientUId: uid },
      {
        headers: getTenantHeaders(),
      }
    )
  },

  /**
   * Buscar cliente por identificación
   */
  findClient: (
    data: IClientFindRequest
  ): Promise<AxiosResponse<IClientFindResponse>> => {
    return axiosInstance.post(buildApiUrl('/clients/find'), data, {
      headers: getTenantHeaders(),
    })
  },

  /**
   * Obtener tipos de identificación
   */
  getIdentificationTypes: (): Promise<AxiosResponse<any[]>> => {
    return axiosInstance.get(buildApiUrl('/id-types/all'), {
      headers: getTenantHeaders(),
    })
  },

  /**
   * Obtener tipos de persona
   */
  getPersonTypes: (): Promise<AxiosResponse<any[]>> => {
    return axiosInstance.get(buildApiUrl('/person-types/all'), {
      headers: getTenantHeaders(),
    })
  },

  /**
   * Obtener países
   */
  getCountries: (search?: string): Promise<AxiosResponse<any[]>> => {
    const params = search ? { search } : {}
    return axiosInstance.get(buildApiUrl('/countries/all'), {
      headers: getTenantHeaders(),
      params,
    })
  },

  /**
   * Obtener ciudades
   */
  getCities: (search?: string): Promise<AxiosResponse<any[]>> => {
    const params = search ? { search } : {}
    return axiosInstance.get(buildApiUrl('/cities/all'), {
      headers: getTenantHeaders(),
      params,
    })
  },

  /**
   * Obtener CIUs
   */
  getCius: (search?: string): Promise<AxiosResponse<any[]>> => {
    const params = search ? { search } : {}
    return axiosInstance.get(buildApiUrl('/cius/all'), {
      headers: getTenantHeaders(),
      params,
    })
  },

  /**
   * Buscar en lista OFAC
   */
  searchOfac: (document: string): Promise<AxiosResponse<any[]>> => {
    return axiosInstance.post(buildApiUrl('/ofac/search'), { document }, {
      headers: getTenantHeaders(),
    })
  },
}

export default clientsRequests
