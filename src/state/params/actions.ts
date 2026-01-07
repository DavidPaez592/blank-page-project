import { type IIdentificationType } from '@/interfaces'
import { ParamsState } from '@/state'

import appRequests from '../requests'

import {
  setAssignPermissionsToOptions,
  setMenuItemsToOptions,
  setPermissionsToOptions,
  setRolesToOptions,
} from './utils'

export const paramsStateActions = {
  getAllAssignPermissions: async () => {
    const { data: permissions } = await appRequests.Params.getAllPermissions({
      text: null,
    })

    ParamsState.assignPermissions.value =
      setAssignPermissionsToOptions(permissions)
  },
  getAllMenuItems: async () => {
    const { data: menuItems } = await appRequests.Params.getAllMenuItems()

    ParamsState.menuItems.value = setMenuItemsToOptions(menuItems)
  },
  getAllPermissions: async () => {
    const { data: permissions } = await appRequests.Params.getAllPermissions({
      text: null,
    })

    ParamsState.permissions.value = setPermissionsToOptions(permissions)
  },
  getAllRoles: async () => {
    const { data: roles } = await appRequests.Params.getAllRoles()

    ParamsState.roles.value = setRolesToOptions(roles)
  },

  getIdTypes: async () => {
    const { data: idTypes } = await appRequests.Params.paramsIdTypes()

    paramsStateActions.updateDocTypes(
      idTypes.map((item) => ({ label: item.label, value: item.uid }))
    )
  },
  getMenuItemsParents: async () => {
    const { data: menuItemsParents } =
      await appRequests.Params.getMenuItemsParents()

    ParamsState.menuItems.value = setMenuItemsToOptions(menuItemsParents)
  },
  searchPermisions: async () => {
    const { data: permissions } = await appRequests.Params.getAllPermissions({
      text: ParamsState.searchPermissionsText.peek(),
    })

    ParamsState.permissions.value = setPermissionsToOptions(permissions)
  },
  setPermissionSearchText: (text: string) => {
    ParamsState.searchPermissionsText.value = text
  },
  updateDocTypes: (docTypesOptions: IIdentificationType[]) => {
    ParamsState.docTypes.value = docTypesOptions
  },
}
