import { batch } from '@preact/signals-react'

import { type IRoute } from '@/interfaces'
import { RoutesState } from '@/state'

import { paramsStateActions } from '../actions'
import appRequests from '../requests'

export const routesStateActions = {
  addRoute: async () => {
    await paramsStateActions.getAllMenuItems()
    batch(() => {
      RoutesState.currentRoute.value = {}
      RoutesState.openDrawer.value = true
    })
  },
  changePagination: (page: number, pageSize: number) => {
    RoutesState.pagination.value = {
      ...RoutesState.pagination.peek(),
      page,
      pageSize,
    }
  },
  createRoute: async (routeData: IRoute) => {
    if (!routeData.private) {
      routeData.menuItemUId = null
      routeData.default = false
      routeData.permissionUId = null
    }

    if (routeData.default) {
      routeData.permissionUId = null
    }

    const { data: RouteResponse } =
      await appRequests.Routes.createRoute(routeData)

    const currentPaginationData = RoutesState.pagination.peek()

    batch(() => {
      RoutesState.pagination.value = {
        ...currentPaginationData,
        data: [RouteResponse, ...currentPaginationData.data],
        total: currentPaginationData.total + 1,
      }
      RoutesState.currentRoute.value = {}
      RoutesState.openDrawer.value = false
    })
  },
  deleteRoute: async (routeUId: string) => {
    await appRequests.Routes.deleteRoute(routeUId)

    const currentPaginationData = RoutesState.pagination.peek()
    RoutesState.pagination.value = {
      ...currentPaginationData,
      data: [...currentPaginationData.data].filter(
        (item) => item.uid !== routeUId
      ),
      total: currentPaginationData.total - 1,
    }
  },
  editRoute: async (routeUId: string) => {
    const [{ data: routeData }] = await Promise.all([
      appRequests.Routes.routeDetail(routeUId),
      paramsStateActions.getAllMenuItems(),
    ])

    batch(() => {
      routeData.uid = routeUId
      RoutesState.currentRoute.value = routeData
      RoutesState.openDrawer.value = true
    })
  },
  getRoutesList: async () => {
    const { page, pageSize } = RoutesState.pagination.peek()

    const [{ data: response }] = await Promise.all([
      appRequests.Routes.getList({
        limit: pageSize,
        page,
      }),
      paramsStateActions.getAllMenuItems(),
      paramsStateActions.getAllPermissions(),
    ])

    RoutesState.pagination.value = {
      ...RoutesState.pagination.peek(),
      data: response.rows,
      total: response.count,
    }
  },
  toggleOpenDrawer: () => {
    RoutesState.openDrawer.value = !RoutesState.openDrawer.peek()
  },
  updateRoute: async (routeData: IRoute) => {
    routeData.uid = RoutesState.currentRoute.peek().uid

    if (!routeData.private) {
      routeData.menuItemUId = null
      routeData.default = false
      routeData.permissionUId = null
    }

    if (routeData.default) {
      routeData.permissionUId = null
    }
    await appRequests.Routes.updateRoute(routeData)

    const currentPaginationData = RoutesState.pagination.peek()

    let currentRoutesData = [...currentPaginationData.data]

    currentRoutesData = currentRoutesData.map((item) => {
      if (item.uid === routeData.uid) return routeData
      return item
    })

    batch(() => {
      RoutesState.pagination.value = {
        ...currentPaginationData,
        data: currentRoutesData,
      }

      RoutesState.currentRoute.value = {}
      RoutesState.openDrawer.value = false
    })
  },
}
