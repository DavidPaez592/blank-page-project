import type {
  IAssignPermissionsOption,
  IMenuItem,
  IMenuItemsOptions,
  IPermission,
  IPermissionsOptions,
  IRole,
  IRoleOption,
} from '@/interfaces'

export const setMenuItemsToOptions = (
  menuItems: IMenuItem[]
): IMenuItemsOptions[] =>
  menuItems.map((item: IMenuItem) => {
    let children: IMenuItemsOptions[] = []
    if (item.children) {
      children = setMenuItemsToOptions(item.children)
    }

    return {
      children,
      label: String(item.label),
      value: item.uid ?? '',
    }
  })

export const setPermissionsToOptions = (
  permissions: IPermission[]
): IPermissionsOptions[] =>
  permissions.map((item: IPermission) => {
    return {
      uid: item.uid,
      label: `${item.name} (${item.code})`,
      type: item.type,
      value: item.uid ?? '',
    }
  })

export const setAssignPermissionsToOptions = (
  permissions: IPermission[]
): IAssignPermissionsOption[] =>
  permissions.map((item: IPermission) => {
    return {
      description: item.description ?? '',
      key: String(item.uid),
      title: `${item.name}`,
    }
  })

export const setRolesToOptions = (roles: IRole[]): IRoleOption[] =>
  roles.map((item: IRole) => {
    return {
      label: `${item.name}`,
      value: item.uid ?? '',
    }
  })
