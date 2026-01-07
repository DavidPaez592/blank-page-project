import type { AxiosResponse } from 'axios'

import axiosInstance, { buildApiUrl } from '@/axios'
import type {
  IMenuItem,
  IRole,
  IUser,
  TAuthCurrentUserState,
  TSignIn,
  TSignupData,
} from '@/interfaces'

interface SignInDataPick {
  user: { tenants?: Array<{ uid: string }> }
}

const authRequests = {
  activateAccount: async (
    accessToken: string
  ): Promise<AxiosResponse<{ token: { bearer: string } }>> => {
    return await axiosInstance.post(buildApiUrl('/auth/activate-account'), {
      code: accessToken,
    })
  },
  authForgotPwd: async (
    email: string
  ): Promise<AxiosResponse<{ code: string; validated: boolean }>> => {
    return await axiosInstance.post(buildApiUrl('/auth/forgot-pwd'), {
      email,
    })
  },
  authLogin: async (
    signinData: TSignIn
  ): Promise<AxiosResponse<{ token: { bearer: string }; user: IUser }>> => {
    const response = await axiosInstance.post(
      buildApiUrl('/auth/signin'),
      signinData
    )
    const data = response.data
    const tenant = data.user.tenants?.[0] as { name: string; uid: string }
    if (tenant) {
      sessionStorage.setItem('tenant_uid', tenant.uid)
      sessionStorage.setItem('tenant_name', tenant.name)
    }
    return response
  },
  authMe: async (): Promise<AxiosResponse<TAuthCurrentUserState>> => {
    const tenantUid = sessionStorage.getItem('tenant_uid')
    return await axiosInstance.get(buildApiUrl('/auth/me'), {
      headers: tenantUid ? { 'x-tenant-uid': tenantUid } : {},
    })
  },
  authResetPwd: async ({
    code,
    password,
  }: {
    code: string | null
    password: string
  }): Promise<AxiosResponse<{ token: { bearer: string } }>> => {
    return await axiosInstance.post(buildApiUrl('/auth/reset-pwd'), {
      code,
      password,
    })
  },
  authSignup: async (
    signupData: TSignupData
  ): Promise<AxiosResponse<{ created: boolean }>> => {
    return await axiosInstance.post(buildApiUrl('/auth/signup'), signupData)
  },
  authValidateForgotPwd: async (
    accessToken: string
  ): Promise<AxiosResponse<{ resetPwdCode: string; validated: boolean }>> => {
    return await axiosInstance.post(buildApiUrl('/auth/validate-forgot-pwd'), {
      code: accessToken,
    })
  },
  changeCurrentRole: async (
    roleUId?: string
  ): Promise<AxiosResponse<{ changed: boolean; roles: IRole[] }>> => {
    const tenantUid = sessionStorage.getItem('tenant_uid')
    return await axiosInstance.post(
      buildApiUrl('/auth/change-current-role'),
      { roleUId },
      { headers: tenantUid ? { 'x-tenant-uid': tenantUid } : {} }
    )
  },
  getMenu: async (): Promise<AxiosResponse<IMenuItem[]>> => {
    const tenantUid = sessionStorage.getItem('tenant_uid')
    return await axiosInstance.get(buildApiUrl('/auth/menu'), {
      headers: tenantUid ? { 'x-tenant-uid': tenantUid } : {},
    })
  },
  getPermissions: async (): Promise<AxiosResponse<string[]>> => {
    const tenantUid = sessionStorage.getItem('tenant_uid')
    return await axiosInstance.get(buildApiUrl('/auth/permissions'), {
      headers: tenantUid ? { 'x-tenant-uid': tenantUid } : {},
    })
  },
}

export default authRequests
