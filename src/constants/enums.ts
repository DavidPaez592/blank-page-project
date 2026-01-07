import { EPermissionType, ETenantStatus } from '@/interfaces'

export const enum EDocTypes {
  CITIZEN_CARD = 'cc',
  PASSPORT = 'passport',
}

export const DOC_TYPES_OPTIONS = [
  {
    label: 'Cédula de Ciudadanía',
    value: EDocTypes.CITIZEN_CARD,
  },
  {
    label: 'Pasaporte',
    value: EDocTypes.PASSPORT,
  },
]

export const PERMISSION_TYPES_OPTIONS = [
  {
    label: 'Validación de Datos',
    value: EPermissionType.DATA,
  },
  {
    label: 'Validación Visual',
    value: EPermissionType.VIEW,
  },
  {
    label: 'Acceso a Rutas',
    value: EPermissionType.ROUTE,
  },
]

export const TENANT_STATUS_OPTIONS = [
  {
    label: 'Activo',
    value: ETenantStatus.Active,
  },
  {
    label: 'Pendiente de Configuración',
    value: ETenantStatus.PendingSetup,
  },
  {
    label: 'Suspendido',
    value: ETenantStatus.Suspended,
  },
]
