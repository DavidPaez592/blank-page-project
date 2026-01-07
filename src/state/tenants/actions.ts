import { batch } from '@preact/signals-react'

import { type ITenant } from '@/interfaces'
import { TenantsState } from '@/state'

import appRequests from '../requests'

export const tenantsStateActions = {
  addTenant: async () => {
    batch(() => {
      TenantsState.currentTenant.value = {}
      TenantsState.openDrawer.value = true
    })
  },
  changePagination: (page: number, pageSize: number) => {
    TenantsState.pagination.value = {
      ...TenantsState.pagination.peek(),
      page,
      pageSize,
    }
  },
  createTenant: async (tenantData: ITenant) => {
    delete tenantData.status
    const { data: TenantResponse } =
      await appRequests.Tenants.createTenant(tenantData)

    const currentPaginationData = TenantsState.pagination.peek()

    batch(() => {
      TenantsState.pagination.value = {
        ...currentPaginationData,
        data: [TenantResponse, ...currentPaginationData.data],
        total: currentPaginationData.total + 1,
      }
      TenantsState.currentTenant.value = {}
      TenantsState.openDrawer.value = false
    })
  },
  deleteTenant: async (tenantUId: string) => {
    await appRequests.Tenants.deleteTenant(tenantUId)

    const currentPaginationData = TenantsState.pagination.peek()
    TenantsState.pagination.value = {
      ...currentPaginationData,
      data: [...currentPaginationData.data].filter(
        (item) => item.uid !== tenantUId
      ),
      total: currentPaginationData.total - 1,
    }
  },
  editTenant: async (tenantUId: string) => {
    const [{ data: tenantData }] = await Promise.all([
      appRequests.Tenants.tenantDetail(tenantUId),
    ])

    batch(() => {
      tenantsStateActions.setDetail(tenantData)
      TenantsState.openDrawer.value = true
    })
  },
  getDetail: async (tenantUId: string) => {
    const [{ data: tenantData }] = await Promise.all([
      appRequests.Tenants.tenantDetail(tenantUId),
    ])

    batch(() => {
      tenantsStateActions.setDetail(tenantData)
    })
  },
  getTenantsList: async () => {
    const { page, pageSize } = TenantsState.pagination.peek()

    const [{ data: response }] = await Promise.all([
      appRequests.Tenants.getList({
        limit: pageSize,
        page,
      }),
    ])

    TenantsState.pagination.value = {
      ...TenantsState.pagination.peek(),
      data: response.tenants.map((item: ITenant) => ({
        ...item,
        key: item.uid,
      })),
      total: response.count,
    }
  },
  setDetail: (tenantData: ITenant) => {
    TenantsState.currentTenant.value = tenantData
  },
  toggleOpenDrawer: () => {
    TenantsState.openDrawer.value = !TenantsState.openDrawer.peek()
  },
  updateTenant: async (tenantData: ITenant) => {
    tenantData.uid = TenantsState.currentTenant.peek().uid

    const { data: TenantResponse } =
      await appRequests.Tenants.updateTenant(tenantData)

    const currentPaginationData = TenantsState.pagination.peek()

    let currentTenantsData = [...currentPaginationData.data]

    currentTenantsData = currentTenantsData.map((item) => {
      if (item.uid === tenantData.uid) return TenantResponse
      return item
    })

    batch(() => {
      TenantsState.pagination.value = {
        ...currentPaginationData,
        data: currentTenantsData,
      }

      TenantsState.currentTenant.value = TenantResponse
      TenantsState.openDrawer.value = false
    })
  },
}
