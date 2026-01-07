/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  computed,
  type ReadonlySignal,
  type Signal,
  signal,
} from '@preact/signals-react'

import type {
  TAuthState,
  TAuthCurrentUserState,
  TAuthModal,
  IMenuItem,
  IRole,
} from '@/interfaces'

import { getRoutePathsFromMenu } from './utils'

const currentUser: Signal<TAuthCurrentUserState> = signal({})
const token: Signal<string | null> = signal(
  sessionStorage.getItem('token') ?? null
)
const resetPwdCode: Signal<string | null> = signal(null)
const isLoggedIn: ReadonlySignal<boolean> = computed(() => {
  return Boolean(token.value && currentUser.value?.uid)
})
const authModal: Signal<TAuthModal> = signal({
  data: null,
  open: false,
  type: null,
})
const currentRole: Signal<string | null> = signal(null)
const menu: Signal<IMenuItem[]> = signal([])
const roles: Signal<IRole[]> = signal([])
const routes: ReadonlySignal<string[]> = computed(() => {
  return getRoutePathsFromMenu(menu.value)
})

const permissions: Signal<string[]> = signal([])

export const AuthState: TAuthState = {
  authModal,
  currentRole,
  currentUser,
  isLoggedIn,
  menu,
  permissions,
  resetPwdCode,
  roles,
  routes,
  token,
}
