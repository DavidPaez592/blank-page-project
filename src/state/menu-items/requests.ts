import type { AxiosResponse } from 'axios'

import axiosInstance, { buildApiUrl } from '@/axios'
import { type IMenuItem } from '@/interfaces'

interface IGetListResponse {
  count: number
  limit: number
  page: number
  rows: IMenuItem[]
}
const MENU_ITEM_BASE_ROUTE = '/menu-items'

const getTenantHeaders = () => {
  const tenantUid = sessionStorage.getItem('tenant_uid')
  return tenantUid ? { 'x-tenant-uid': tenantUid } : {}
}

const menuItemsRequests = {
  createMenuItem: async (
    menuItemData: IMenuItem
  ): Promise<AxiosResponse<IMenuItem>> => {
    return await axiosInstance.post(
      buildApiUrl(`${MENU_ITEM_BASE_ROUTE}`),
      menuItemData,
      {
        headers: getTenantHeaders(),
      }
    )
  },
  deleteMenuItem: async (
    menuItemUId: string
  ): Promise<AxiosResponse<IMenuItem>> => {
    return await axiosInstance.delete(buildApiUrl(`${MENU_ITEM_BASE_ROUTE}`), {
      data: {
        uid: menuItemUId,
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
    return await axiosInstance.post(
      buildApiUrl(`${MENU_ITEM_BASE_ROUTE}/list`),
      {
        limit,
        page,
      },
      { headers: getTenantHeaders() }
    )
  },
  menuItemDetail: async (
    menuItemUId: string
  ): Promise<AxiosResponse<IMenuItem>> => {
    return await axiosInstance.post(
      buildApiUrl(`${MENU_ITEM_BASE_ROUTE}/detail`),
      {
        uid: menuItemUId,
      },
      { headers: getTenantHeaders() }
    )
  },
  updateMenuItem: async (
    menuItemData: IMenuItem
  ): Promise<AxiosResponse<IMenuItem>> => {
    return await axiosInstance.patch(
      buildApiUrl(`${MENU_ITEM_BASE_ROUTE}`),
      menuItemData,
      {
        headers: getTenantHeaders(),
      }
    )
  },
}

export default menuItemsRequests
