import type { Signal } from '@preact/signals-react'
import { type Moment } from 'moment'

import type { IPagination, ModelBase } from './common'
import type { EUserCodeTypes, EUserStatus, ETenantUserStatus } from './enums'
import type { IRole } from './roles'
import { ICashBox } from './cashboxes'

export interface IUser extends ModelBase {
  authPersonalData?: boolean
  authTermsAndConditions?: boolean
  birthdate?: string | Moment
  confirmEmail?: string
  currentRole?: IRole | null
  currentRoleId?: number | null
  email?: string
  firstName?: string
  firstSurname?: string
  identificationNumber?: string
  identificationTypeUId?: string
  password?: string
  phoneLandline?: string | undefined
  phoneMobile?: string | undefined
  roles?: IRole[] | string[]
  secondName?: string | undefined
  secondSurname?: string | undefined
  status?: EUserStatus
  tenants?: Array<{
    name: string
    uid: string
    status?: ETenantUserStatus
  }>
}

export interface IUserCode extends ModelBase {
  code?: string
  type?: EUserCodeTypes
  userId?: number
  validated?: boolean
}

export interface IUserPermission extends ModelBase {
  defaultAssign?: boolean
  permissionId?: number
  roleId?: number
  userId?: number
}

export interface IUserRole extends ModelBase {
  roleId?: number
  userId?: number
}

export interface IUserPagination extends IPagination {
  data: IUser[]
}

export interface IUserFilters {
  text: string | null
}

export interface IBoxesUser {
  uid: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface IUsersState {
  currentPermissionsRoleUId: Signal<string | null>
  currentUser: Signal<IUser>
  filters: Signal<IUserFilters>
  openDrawer: Signal<boolean>
  openPermissionsDrawer: Signal<boolean>
  openTenantsDrawer: Signal<boolean>
  pagination: Signal<IUserPagination>
  permissions: Signal<string[]>
  selectedUserTenants: Signal<string[]>
  users: Signal<IUser[]>
  userCashBoxes: Signal<ICashBox[]>
  openCashBoxesDrawer: Signal<boolean>
}
