/* eslint-disable promise/no-promise-in-callback */
import axios, { type AxiosResponse, type ResponseType } from 'axios'

import { AuthState } from '@/state'

const { token } = AuthState

const DEFAULT_RESPONSE_TYPE: ResponseType = 'json'
const SUCCESS_STATUS = [200, 201]

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const buildApiUrl = (
  path: string,
  options?: { version?: string; prefix?: string }
): string => {
  const prefixSegment = options?.prefix ? `/${options.prefix}` : ''
  const versionSegment = `/${options?.version || 'v1'}`
  const pathSegment = path.startsWith('/') ? path : `/${path}`

  return `${prefixSegment}${versionSegment}${pathSegment}`
}

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers['Content-Type'] =
      config.headers['Content-Type'] ?? 'application/json'

    config.responseType = DEFAULT_RESPONSE_TYPE

    if (token.peek() !== null) {
      config.headers.Authorization = `Bearer ${token.peek()}`
    }

    return config
  },
  async function (error) {
    return await Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (SUCCESS_STATUS.includes(response.status)) {
      return response.data
    }
  },
  async function (error) {
    const response = error.response
    return await Promise.reject(response.data ?? error)
  }
)

export default axiosInstance
