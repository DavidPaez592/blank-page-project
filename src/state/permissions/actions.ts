import { batch } from '@preact/signals-react'

import { type IPermission, type EPermissionType } from '@/interfaces'
import { PermissionsState } from '@/state'

import { paramsStateActions } from '../actions'
import appRequests from '../requests'

export const permissionsStateActions = {
  addPermission: async () => {
    await paramsStateActions.getAllPermissions()
    batch(() => {
      PermissionsState.currentPermission.value = {
        deletable: true,
        modifiable: true,
        onlyDev: false,
      }
      PermissionsState.openDrawer.value = true
    })
  },
  changePagination: (page: number, pageSize: number) => {
    PermissionsState.pagination.value = {
      ...PermissionsState.pagination.peek(),
      page,
      pageSize,
    }
  },
  changeSelectorType: (type: EPermissionType) => {
    batch(() => {
      PermissionsState.pagination.value = {
        ...PermissionsState.pagination.peek(),
        page: 1,
      }
      PermissionsState.activeType.value = type
    })
  },
  createPermission: async (permissionData: IPermission) => {
    const { data: permissionResponse } =
      await appRequests.Permissions.createPermission(permissionData)

    if (PermissionsState.activeType.peek() === permissionData.type) {
      const currentPaginationData = PermissionsState.pagination.peek()

      batch(() => {
        PermissionsState.pagination.value = {
          ...currentPaginationData,
          data: [permissionResponse, ...currentPaginationData.data],
          total: currentPaginationData.total + 1,
        }
        PermissionsState.openDrawer.value = false
        PermissionsState.currentPermission.value = {}
      })
    }
  },
  deletePermission: async (permissionUId: string) => {
    await appRequests.Permissions.deletePermission(permissionUId)

    const currentPaginationData = PermissionsState.pagination.peek()
    PermissionsState.pagination.value = {
      ...currentPaginationData,
      data: [...currentPaginationData.data].filter(
        (item) => item.uid !== permissionUId
      ),
      total: currentPaginationData.total - 1,
    }
  },
  editPermission: async (permissionUId: string) => {
    const [{ data: permissionData }] = await Promise.all([
      appRequests.Permissions.permissionDetail(permissionUId),
      paramsStateActions.getAllPermissions(),
    ])
    batch(() => {
      permissionData.uid = permissionUId
      PermissionsState.currentPermission.value = permissionData
      PermissionsState.openDrawer.value = true
    })
  },
  getPermissionsList: async () => {
    const { page, pageSize } = PermissionsState.pagination.peek()
    const { data: response } = await appRequests.Permissions.getList({
      limit: pageSize,
      page,
      type: PermissionsState.activeType.peek(),
    })

    PermissionsState.pagination.value = {
      ...PermissionsState.pagination.peek(),
      data: response.rows,
      total: response.count,
    }
  },
  toggleOpenDrawer: () => {
    PermissionsState.openDrawer.value = !PermissionsState.openDrawer.peek()
  },
  updatePermission: async (permissionData: IPermission) => {
    permissionData.uid = PermissionsState.currentPermission.peek().uid

    await appRequests.Permissions.updatePermission(permissionData)

    const currentPaginationData = PermissionsState.pagination.peek()

    const isSameType =
      permissionData.type === PermissionsState.activeType.peek()

    let currentPermissionsData = [...currentPaginationData.data]

    if (isSameType) {
      currentPermissionsData = currentPermissionsData.map((item) => {
        if (item.uid === permissionData.uid) return permissionData
        return item
      })
    } else {
      currentPermissionsData = currentPermissionsData.filter(
        (item) => item.uid !== permissionData.uid
      )
    }

    batch(() => {
      PermissionsState.pagination.value = {
        ...currentPaginationData,
        data: currentPermissionsData,
      }

      PermissionsState.openDrawer.value = false
      PermissionsState.currentPermission.value = {}
    })
  },
}
