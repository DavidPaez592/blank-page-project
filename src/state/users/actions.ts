import { batch } from '@preact/signals-react'
import moment from 'moment'

import { type IUserFilters, type IUser } from '@/interfaces'
import { UsersState } from '@/state'

import { paramsStateActions } from '../actions'
import appRequests from '../requests'

export const usersStateActions = {
  addUser: async () => {
    batch(() => {
      UsersState.currentUser.value = {}
      UsersState.openDrawer.value = true
    })
  },
  assignPermissions: async () => {
    const roleUId = UsersState.currentPermissionsRoleUId.peek()

    if (roleUId) {
      const { data: AssignResponse } =
        await appRequests.Users.assignPermissions({
          permissions: UsersState.permissions.peek().map((item) => item),
          roleUId,
          uid: UsersState.currentUser.peek().uid ?? '',
        })

      if (!AssignResponse.assigned) {
        throw new Error('Error assigning permissions')
      }
    }
  },
  changePagination: (page: number, pageSize: number) => {
    UsersState.pagination.value = {
      ...UsersState.pagination.peek(),
      page,
      pageSize,
    }
  },
  closePermissionDrawer: () => {
    UsersState.currentPermissionsRoleUId.value = null
    UsersState.permissions.value = []
    UsersState.openPermissionsDrawer.value = false
  },
  createUser: async (userData: IUser) => {
    delete userData.confirmEmail

    const { data: UserResponse } = await appRequests.Users.createUser(userData)

    const currentPaginationData = UsersState.pagination.peek()

    batch(() => {
      UsersState.pagination.value = {
        ...currentPaginationData,
        data: [UserResponse, ...currentPaginationData.data],
        total: currentPaginationData.total + 1,
      }
      UsersState.currentUser.value = {}
      UsersState.openDrawer.value = false
    })
  },
  deleteUser: async (userUId: string) => {
    await appRequests.Users.deleteUser(userUId)

    const currentPaginationData = UsersState.pagination.peek()
    UsersState.pagination.value = {
      ...currentPaginationData,
      data: [...currentPaginationData.data].filter(
        (item) => item.uid !== userUId
      ),
      total: currentPaginationData.total - 1,
    }
  },
  editUser: async (userUid: string) => {
    const [{ data: userData }] = await Promise.all([
      appRequests.Users.userDetail(userUid),
    ])

    userData.birthdate = userData.birthdate
      ? moment(userData.birthdate)
      : undefined

    batch(() => {
      usersStateActions.setDetail(userData)
      UsersState.openDrawer.value = true
    })
  },
  getDetail: async (userUid: string) => {
    const [{ data: userData }] = await Promise.all([
      appRequests.Users.userDetail(userUid),
    ])

    usersStateActions.setDetail(userData)
  },

  getPermissions: async () => {
    const roleId = Number(UsersState.currentPermissionsRoleUId.peek())
    const userId = Number(UsersState.currentUser.peek().id)

    if (userId && roleId) {
      const [{ data: PermissionsResponse }] = await Promise.all([
        appRequests.Users.getPermissions({
          roleId,
          userId,
        }),
        paramsStateActions.getAllAssignPermissions(),
      ])

      UsersState.permissions.value = PermissionsResponse.map((item) =>
        String(item)
      )
    }
  },
  getUsersList: async () => {
    const { page, pageSize } = UsersState.pagination.peek()

    const [{ data: response }] = await Promise.all([
      appRequests.Users.getList({
        filters: UsersState.filters.peek(),
        limit: pageSize,
        page,
      }),
      paramsStateActions.getAllRoles(),
      paramsStateActions.getIdTypes(),
    ])

    UsersState.pagination.value = {
      ...UsersState.pagination.peek(),
      data: response.rows,
      total: response.count,
    }
  },
  setCurrentPermissionRoleUId: (roleUId: string) => {
    UsersState.currentPermissionsRoleUId.value = roleUId
  },
  setDetail: (userData: IUser) => {
    UsersState.currentUser.value = userData
  },
  setFilterText: (filters: IUserFilters) => {
    batch(() => {
      UsersState.filters.value = filters
      UsersState.pagination.value = {
        ...UsersState.pagination.peek(),
        page: 1,
      }
    })
  },
  setNewPermissions: (newPermissions: string[]) => {
    UsersState.permissions.value = newPermissions
  },
  showPermissionDrawer: async (userUId: string) => {
    await Promise.all([
      usersStateActions.getDetail(String(userUId)),
      paramsStateActions.getAllRoles(),
      paramsStateActions.getAllAssignPermissions(),
    ])

    const userRoles = UsersState.currentUser.peek().roles
    if (userRoles?.length) {
      const roleUId =
        UsersState.currentPermissionsRoleUId.peek() ?? userRoles[0]

      batch(() => {
        UsersState.currentPermissionsRoleUId.value = roleUId as string
        usersStateActions.toggleOpenPermissionDrawer()
      })
    }
  },
  toggleOpenDrawer: () => {
    UsersState.openDrawer.value = !UsersState.openDrawer.peek()
  },
  toggleOpenPermissionDrawer: () => {
    UsersState.openPermissionsDrawer.value =
      !UsersState.openPermissionsDrawer.peek()
  },
  toggleOpenCashBoxesDrawer: () => {
    UsersState.openCashBoxesDrawer.value =
      !UsersState.openCashBoxesDrawer.peek()
  },
  updateUser: async (userData: IUser) => {
    userData.uid = UsersState.currentUser.peek().uid
    delete userData.confirmEmail

    await appRequests.Users.updateUser(userData)
    await usersStateActions.getUsersList()

    batch(() => {
      UsersState.currentUser.value = {}
      UsersState.openDrawer.value = false
    })
  },
  // Tenant Management Actions
  getUserTenants: async (userUId: string) => {
    const [{ data: userData }] = await Promise.all([
      appRequests.Users.userDetail(userUId),
    ])

    batch(() => {
      UsersState.currentUser.value = userData
      UsersState.selectedUserTenants.value =
        userData.tenants?.map((tenant) => tenant.uid) || []
      UsersState.openTenantsDrawer.value = true
    })
  },
  getUserCashBoxes: async (userUId: string) => {
    const [{ data: userData }, { data: cashBoxes }] = await Promise.all([
      appRequests.Users.userDetail(userUId),
      appRequests.Users.getUserCashBoxes(userUId),
    ])

    batch(() => {
      UsersState.currentUser.value = userData
      UsersState.userCashBoxes.value = cashBoxes
      UsersState.openCashBoxesDrawer.value = true
    })
  },
  assignTenant: async (userUid: string, tenantUId: string, status?: string) => {
    await appRequests.Users.assignTenant({ userUid, tenantUId, status })
  },
  removeTenant: async (userUid: string, tenantUId: string) => {
    await appRequests.Users.removeTenant({ userUid, tenantUId })
  },
  setSelectedTenants: (tenantUids: string[]) => {
    UsersState.selectedUserTenants.value = tenantUids
  },
  toggleOpenTenantsDrawer: () => {
    UsersState.openTenantsDrawer.value = !UsersState.openTenantsDrawer.peek()
  },
}
