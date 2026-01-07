/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { batch } from '@preact/signals-react'

/* import axiosInstance from '@/axios' */
import { AUTH_MODALS_INFO } from '@/constants/auth'
import {
  EAuthModalTypes,
  type TForgotPwdData,
  type TResetPwdData,
  type TSignIn,
  type TSignupData,
} from '@/interfaces'
import { AuthState } from '@/state'

import appRequests from '../requests'

// effect removed to avoid duplicating the /auth/me call

import { clientsStateActions } from '@/state/clients/actions'

export const authStateActions = {
  getMe: async () => {
    const { data: userData } = await appRequests.Auth.authMe()

    batch(() => {
      AuthState.currentUser.value = userData
      AuthState.currentRole.value =
        userData.currentRoleUId ?? userData.roles?.[0]?.uid ?? null
      AuthState.roles.value = userData.roles ?? []
    })
  },
  getMenu: async () => {
    const { data: menu } = await appRequests.Auth.getMenu()

    AuthState.menu.value = menu
  },
  getPermissions: async () => {
    const { data: permissions } = await appRequests.Auth.getPermissions()

    AuthState.permissions.value = permissions
  },

  handleActivateAccount: async (accessToken: string) => {
    const authData = await appRequests.Auth.activateAccount(accessToken)

    const token = authData.data.token.bearer

    authStateActions.handleSetAuthToken(token)
  },
  handleChangeCurrentRole: async (roleUId?: string) => {
    const currentRoleUId = AuthState.currentUser.peek().currentRoleUId
    const resolvedRoleUId = roleUId ?? currentRoleUId ?? ''

    const {
      data: { changed, roles: newRoles },
    } = await appRequests.Auth.changeCurrentRole(resolvedRoleUId)

    if (!changed) throw Error('Error changing current role')

    AuthState.currentRole.value = resolvedRoleUId
    AuthState.roles.value = newRoles
  },
  handleCheckResetPwdToken: async (accessToken: string) => {
    const { data: validateData } =
      await appRequests.Auth.authValidateForgotPwd(accessToken)

    if (!validateData.validated) throw Error('Error validating token')

    AuthState.resetPwdCode.value = validateData.resetPwdCode
  },
  handleCloseAuthModal: () => {
    AuthState.authModal.value = {
      data: null,
      open: false,
      type: null,
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleForgotPwd: async (forgotPwdData: TForgotPwdData) => {
    await appRequests.Auth.authForgotPwd(forgotPwdData.email)
  },
  handleLogin: async (signinData: TSignIn) => {
    const authData = await appRequests.Auth.authLogin(signinData)

    const token = authData.data.token.bearer
    const tenants = authData.data.user?.tenants ?? []
    authStateActions.handleSetAuthToken(token)
    // Guarda todos los tenants en el sessionStorage
    sessionStorage.setItem('tenants', JSON.stringify(tenants))
    // Guarda el primer tenant_uid por defecto (opcional)
    if (tenants.length > 0) {
      sessionStorage.setItem('tenant_uid', String(tenants[0].uid))
    }
    await authStateActions.reloadCurrentRole()
  },

  handleLogout: async () => {
    batch(() => {
      AuthState.currentUser.value = {}
      AuthState.token.value = null
      AuthState.menu.value = []
      AuthState.permissions.value = []
      AuthState.currentRole.value = null

      // Limpiar estado de clientes
      clientsStateActions.resetState()

      sessionStorage.clear()
    })
  },
  handleResetPwd: async (resetPwdData: TResetPwdData) => {
    const authData = await appRequests.Auth.authResetPwd({
      code: AuthState.resetPwdCode.peek(),
      password: resetPwdData.password,
    })

    const token = authData.data.token.bearer

    authStateActions.handleSetAuthToken(token)
  },
  handleSetAuthModalType: (type: EAuthModalTypes) => {
    batch(() => {
      let authData = null

      if (type === EAuthModalTypes.AUTH_PERSONAL_DATA) {
        authData = AUTH_MODALS_INFO.PersonalData
      }

      if (type === EAuthModalTypes.TERMS_AND_CONDITIONS) {
        authData = AUTH_MODALS_INFO.TermsAndConditions
      }

      AuthState.authModal.value = {
        data: authData,
        open: true,
        type,
      }
    })
  },
  handleSetAuthToken: (token: string) => {
    AuthState.token.value = token

    sessionStorage.setItem('token', token)
  },
  handleSignup: async (signupData: TSignupData) => {
    const { confirmEmail, confirmPassword, ...REST_SIGNUP_DATA } = signupData

    const { data: response } =
      await appRequests.Auth.authSignup(REST_SIGNUP_DATA)

    if (!response.created) throw Error('Error registering new user')
  },
  reloadCurrentRole: async () => {
    await Promise.all([
      authStateActions.getMe(),
      authStateActions.getMenu(),
      authStateActions.getPermissions(),
    ])
  },
}
