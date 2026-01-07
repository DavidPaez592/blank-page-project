import { batch } from '@preact/signals-react'

import { type IRole } from '@/interfaces'
import { RolesState } from '@/state'

import { paramsStateActions } from '../actions'
import appRequests from '../requests'

import { setDefaultRole } from './utils'

export const rolesStateActions = {
  addRole: async () => {
    batch(() => {
      RolesState.currentRole.value = {
        deletable: true,
        modifiable: true,
      }
      RolesState.openDrawer.value = true
    })
  },
  assignPermissions: async () => {
    const { data: AssignResponse } = await appRequests.Roles.assignPermissions({
      permissions: RolesState.permissions.peek().map((item) => item),
      roleUId: RolesState.currentRole.peek().uid ?? '',
    })

    if (!AssignResponse.assigned) {
      throw new Error('Error assigning permissions')
    }
  },
  changePagination: (page: number, pageSize: number) => {
    RolesState.pagination.value = {
      ...RolesState.pagination.peek(),
      page,
      pageSize,
    }
  },
  createRole: async (roleData: IRole) => {
    const { data: RoleResponse } = await appRequests.Roles.createRole(roleData)

    const currentPaginationData = RolesState.pagination.peek()

    batch(() => {
      RolesState.pagination.value = {
        ...currentPaginationData,
        data: [RoleResponse, ...currentPaginationData.data],
        total: currentPaginationData.total + 1,
      }
      RolesState.currentRole.value = {}
      RolesState.openDrawer.value = false
    })
  },
  deleteRole: async (roleUId: string) => {
    await appRequests.Roles.deleteRole(roleUId)

    const currentPaginationData = RolesState.pagination.peek()
    RolesState.pagination.value = {
      ...currentPaginationData,
      data: [...currentPaginationData.data].filter(
        (item) => item.uid !== roleUId
      ),
      total: currentPaginationData.total - 1,
    }
  },
  editRole: async (roleUId: string) => {
    const [{ data: roleData }] = await Promise.all([
      appRequests.Roles.roleDetail(roleUId),
    ])

    batch(() => {
      rolesStateActions.setDetail(roleData)
      RolesState.openDrawer.value = true
    })
  },
  getDetail: async (
    roleUId: string,
    checkModifiable?: boolean,
    modifiableValue?: boolean
  ) => {
    const [{ data: roleData }] = await Promise.all([
      appRequests.Roles.roleDetail(roleUId),
    ])

    if (checkModifiable && roleData.modifiable !== modifiableValue) {
      throw new Error('Error getting role data')
    }

    batch(() => {
      rolesStateActions.setDetail(roleData)
    })
  },
  getPermissions: async (roleUId: string) => {
    const [{ data: PermissionsResponse }] = await Promise.all([
      appRequests.Roles.getPermissions(roleUId),
      rolesStateActions.getDetail(roleUId),
      paramsStateActions.getAllAssignPermissions(),
    ])

    batch(() => {
      RolesState.permissions.value = PermissionsResponse.map((item) =>
        String(item)
      )
      rolesStateActions.toggleOpenPermissionDrawer()
    })
  },
  getRolesList: async () => {
    const { page, pageSize } = RolesState.pagination.peek()

    const [{ data: response }] = await Promise.all([
      appRequests.Roles.getList({
        limit: pageSize,
        page,
      }),
    ])

    RolesState.pagination.value = {
      ...RolesState.pagination.peek(),
      data: response.rows.map((item) => ({
        ...item,
        key: item.uid,
      })),
      total: response.count,
    }
  },
  setDefault: async (roleUId: string) => {
    await appRequests.Roles.setDefault(roleUId)
    RolesState.pagination.value = {
      ...RolesState.pagination.peek(),
      data: setDefaultRole({
        roleUid: roleUId,
        roles: RolesState.pagination.peek().data,
      }),
    }
  },
  setDetail: (roleData: IRole) => {
    RolesState.currentRole.value = roleData
  },
  setNewPermissions: (newPermissions: string[]) => {
    RolesState.permissions.value = newPermissions
  },
  toggleOpenDrawer: () => {
    RolesState.openDrawer.value = !RolesState.openDrawer.peek()
  },
  toggleOpenPermissionDrawer: () => {
    RolesState.openPermissionsDrawer.value =
      !RolesState.openPermissionsDrawer.peek()
  },
  updateRole: async (roleData: IRole) => {
    roleData.uid = RolesState.currentRole.peek().uid

    const { data: RoleResponse } = await appRequests.Roles.updateRole(roleData)

    const currentPaginationData = RolesState.pagination.peek()

    let currentRolesData = [...currentPaginationData.data]

    currentRolesData = currentRolesData.map((item) => {
      if (item.uid === roleData.uid) return RoleResponse
      return item
    })

    batch(() => {
      RolesState.pagination.value = {
        ...currentPaginationData,
        data: currentRolesData,
      }

      RolesState.currentRole.value = {}
      RolesState.openDrawer.value = false
    })
  },
}
