/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/always-return */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  type ReadonlySignal,
  type Signal,
  useComputed,
  useSignal,
} from '@preact/signals-react'
import moment from 'moment'
import react, { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { consoleLog } from 'wd-util/dist/helpers/consoleLog'

import { createNotification } from '@/components/notification'
import { PUBLIC_ROUTE } from '@/constants'
import type {
  TForgotPwdData,
  TResetPwdData,
  TSignIn,
  TSignupData,
} from '@/interfaces'
import { AuthState } from '@/state'
import { authStateActions, paramsStateActions } from '@/state/actions'

interface AuthResult {
  handleChangeCurrentRole: (roleUId: string) => void
  handleForgotPwd: (values: TForgotPwdData) => void
  handleLogin: (values: TSignIn) => void
  handleLogout: () => void
  handleReloadRole: () => void
  handleResetPwd: (values: TResetPwdData) => void
  handleSignup: (values: TSignupData) => void
  isLoading: Signal<boolean>
}

export const useAuth = (): AuthResult => {
  const isLoading = useSignal(false)
  const navigate = useNavigate()

  const handleChangeCurrentRole = (roleUId: string): void => {
    isLoading.value = true
    authStateActions
      .handleChangeCurrentRole(roleUId)
      .then(() =>
        createNotification(
          'success',
          'Rol actualizado',
          'Ahora puedes seguir utilizando la plataforma con el rol seleccionado'
        )
      )
      .finally(() => {
        isLoading.value = false
      })
      .catch((error) => {
        createNotification('error', 'Error', error.message as string)
        consoleLog.error('CHANGECURRENTROLE::ERROR', error)
      })
  }

  const handleReloadRole = (): void => {
    isLoading.value = true
    authStateActions
      .reloadCurrentRole()
      .then(() =>
        createNotification(
          'success',
          'Rol refrescado',
          'Ahora puedes seguir utilizando la plataforma con el mismo rol'
        )
      )
      .finally(() => {
        isLoading.value = false
      })
      .catch((error) => {
        createNotification('error', 'Error', error.message as string)
        consoleLog.error('RELOADCURRENTROLE::ERROR', error)
      })
  }

  const handleLogin = (values: TSignIn): void => {
    isLoading.value = true

    authStateActions
      .handleLogin(values)
      .finally(() => {
        isLoading.value = false
      })
      .catch((error) => {
        createNotification('error', 'Error', error.message as string)
        consoleLog.error('SIGNIN::ERROR', error)
      })
  }

  const handleLogout = (): void => {
    authStateActions.handleLogout().catch((error) => {
      createNotification('error', 'Error', error.message as string)
      consoleLog.error('LOGOUT::ERROR', error)
    })
  }

  const handleSignup = (signupData: TSignupData): void => {
    isLoading.value = true
    signupData.birthdate = moment(signupData.birthdate).format('YYYY-MM-DD')
    authStateActions
      .handleSignup(signupData)
      .then(() =>
        createNotification(
          'success',
          'Registro exitoso',
          'Te invitamos a revisar tu correo para realizar la activación de tu cuenta'
        )
      )
      .finally(() => {
        isLoading.value = false
        navigate(PUBLIC_ROUTE.SIGN_IN)
      })
      .catch((error) => {
        createNotification('error', 'Error', error.message as string)
        consoleLog.error('SIGNUP::ERROR', error)
      })
  }

  const handleForgotPwd = (forgotPwdData: TForgotPwdData): void => {
    isLoading.value = true
    authStateActions
      .handleForgotPwd(forgotPwdData)
      .finally(() => {
        isLoading.value = false
      })
      .then(() =>
        createNotification(
          'success',
          'Proceso iniciado',
          'Te invitamos a revisar tu correo para continuar con el proceso de restablecimiento de contraseña'
        )
      )
      .catch((error) => {
        createNotification('error', 'Error', error.message as string)
        consoleLog.error('FORGOTPWD::ERROR', error)
      })
  }

  const handleResetPwd = (resetPwdData: TResetPwdData): void => {
    isLoading.value = true
    authStateActions
      .handleResetPwd(resetPwdData)
      .finally(() => {
        isLoading.value = false
      })
      .then(() =>
        createNotification(
          'success',
          'Actualización exitosa',
          'El reestablecimiento de la contraseña se ha realizado exitosamente'
        )
      )
      .catch((error) => {
        createNotification('error', 'Error', error.message as string)
        consoleLog.error('RESETPWD::ERROR', error)
      })
  }

  return {
    handleChangeCurrentRole,
    handleForgotPwd,
    handleLogin,
    handleLogout,
    handleReloadRole,
    handleResetPwd,
    handleSignup,
    isLoading,
  }
}

interface ResetPwdResult {
  isValidated: Signal<boolean>
}

export const useResetPwd = (): ResetPwdResult => {
  const isValidated = useSignal(false)
  const navigate = useNavigate()
  const accessTokenSignal = useSignal<string | null>(null)

  const [searchParams] = useSearchParams()

  const accessToken = useMemo(
    () => searchParams.get('accessToken'),
    [searchParams]
  )

  const handleCheckResetToken = useCallback(async (): Promise<void> => {
    if (accessToken && accessToken !== accessTokenSignal.peek()) {
      try {
        await authStateActions.handleCheckResetPwdToken(accessToken)
        isValidated.value = true
      } catch (error: unknown) {
        createNotification(
          'error',
          'Error',
          (error as { message: string }).message
        )
        consoleLog.error('CHECKRESETPWDTOKEN::ERROR', error)
        navigate('/signin')
      }
    }
  }, [accessToken, accessTokenSignal, isValidated, navigate])

  useEffect(() => {
    handleCheckResetToken().catch((error) => {
      consoleLog.error('USEEFFECT::ERROR', error)
    })
  }, [accessToken, handleCheckResetToken])

  return {
    isValidated,
  }
}

export const useActivateAccount = (): void => {
  const navigate = useNavigate()
  const accessTokenSignal = useSignal<string | null>(null)

  const [searchParams] = useSearchParams()

  const accessToken = useMemo(
    () => searchParams.get('accessToken'),
    [searchParams]
  )

  const handleActivateAccountToken = useCallback(async (): Promise<void> => {
    if (accessToken && accessToken !== accessTokenSignal.peek()) {
      accessTokenSignal.value = accessToken
      try {
        await authStateActions.handleActivateAccount(accessToken)
        createNotification(
          'success',
          'Proceso exitoso',
          'La cuenta ha sido activada exitosamente'
        )
      } catch (error: unknown) {
        createNotification(
          'error',
          'Error',
          (error as { message: string }).message
        )
        consoleLog.error('ACTIVATEACCOUNT::ERROR', error)
        navigate('/signin')
      }
    }
  }, [accessToken, accessTokenSignal, navigate])

  useEffect(() => {
    handleActivateAccountToken().catch((error) => {
      consoleLog.error('USEEFFECT::ERROR', error)
    })
  }, [accessToken, handleActivateAccountToken])
}

interface AuthSignup {
  handleSignup: (values: TSignupData) => void
  isLoading: Signal<boolean>
  isLoadingIdTypes: Signal<boolean>
}
export const useAuthSignUp = (): AuthSignup => {
  const { handleSignup, isLoading } = useAuth()
  const isLoadingIdTypes = useSignal(true)
  const navigate = useNavigate()

  const handleGetIdTypes = async (): Promise<void> => {
    await paramsStateActions
      .getIdTypes()
      .finally(() => {
        isLoadingIdTypes.value = false
      })
      .catch((error) => {
        createNotification('error', 'Error', error.message as string)
        consoleLog.error('PARAMSIDTYPES::ERROR', error)
        navigate('/signin')
      })
  }

  react.useEffect(() => {
    handleGetIdTypes().catch((error) => {
      consoleLog.error('USEEFFECT::ERROR', error)
    })
  }, [])

  return { handleSignup, isLoading, isLoadingIdTypes }
}

export const useCheckPathAccess = (): void => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleCheckPathAccess = (): void => {
    if (!AuthState.routes.value.includes(pathname)) {
      navigate('/')
    }
  }

  react.useEffect(() => {
    handleCheckPathAccess()
  }, [pathname, AuthState.routes.value])
}

interface ICheckAccessResult {
  hasAccess: ReadonlySignal<boolean>
}
export const useCheckAccess = (
  permission: string | string[]
): ICheckAccessResult => {
  const hasAccess = useComputed(() => {
    const currentUserPermissions = AuthState.permissions.value
    if (Array.isArray(permission)) {
      return !permission.some((item) => !currentUserPermissions.includes(item))
    }

    return currentUserPermissions.includes(permission) ?? false
  })

  return {
    hasAccess,
  }
}
