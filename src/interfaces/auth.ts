import { type Signal, type ReadonlySignal } from '@preact/signals-react'

import type { ModelBase } from './common'
import type { EUserStatus } from './enums'
import type { IMenuItem } from './menuItem'
import type { IRole } from './roles'

export const enum EAuthModalTypes {
  AUTH_PERSONAL_DATA = 'authPersonalData',
  TERMS_AND_CONDITIONS = 'termsAndConditions',
}

export interface TAuthModal {
  data: null | {
    text: string
    title: string
  }
  open: boolean
  type: null | string
}
export interface TForgotPwdData {
  email: string
}

export interface TResetPwdData {
  confirmPassword: string
  password: string
}

export interface TSignupData {
  authPersonalData: boolean
  authTermsAndConditions: boolean
  birthdate: string
  confirmEmail?: string
  confirmPassword?: string
  email: string
  firstName: string
  firstSurname: string
  identificationNumber: string
  identificationType: string
  password: string
  secondName?: string
  secondSurname?: string
}

export interface TSignIn {
  email: string
  password: string
}

export interface TAuthCurrentUserState extends ModelBase {
  birthdate?: string
  currentRole?: IRole | null
  currentRoleId?: number | null
  currentRoleUId?: string | null
  email?: string
  firstName?: string
  firstSurname?: string
  id?: number
  identificationNumber?: string
  identificationType?: string
  identificationTypeId?: number
  phoneLandline?: string | undefined
  phoneMobile?: string | undefined
  role?: string
  roles?: IRole[]
  secondName?: string
  secondSurname?: string
  status?: EUserStatus
}

export interface TAuthState {
  authModal: Signal<TAuthModal>
  currentRole: Signal<string | null>
  currentUser: Signal<TAuthCurrentUserState>
  isLoggedIn: ReadonlySignal<boolean>
  menu: Signal<IMenuItem[]>
  permissions: Signal<string[]>
  resetPwdCode: Signal<string | null>
  roles: Signal<IRole[]>
  routes: ReadonlySignal<string[]>
  token: Signal<string | null>
}

/**
 * Interface representing login values.
 * - password: Password for login.
 * - username: Username for login.
 */
export interface LoginValues {
  email: string
  password: string
}

/**
 * Interface representing a status.
 * - code: Status code.
 * - message: Status message.
 */
interface Status {
  code: number
  message: string
}

/**
 * Interface representing a user.
 * - email: User's email address.
 * - full name: User's full name.
 * - isAdmin: Indicates whether the user is an administrator.
 * - role: User's role.
 * - username: User's username.
 */
export interface User {
  email: string
  fullName: string
  isAdmin: boolean
  role: string
  username: string
}

/**
 * Interface representing a data item.
 * - expireAt: Expiration time in milliseconds.
 * - token: Authentication token.
 * - user: Associated user data.
 */
interface DataItem {
  expireAt: number
  token: string
  user: User
}

/**
 * Interface representing an authentication response.
 * - data: Array of data items.
 * - status: Authentication status.
 */
export interface AuthResponse {
  data: DataItem
  status: Status
}
