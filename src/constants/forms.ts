import { ETenantUserStatus, EUserStatus } from '@/interfaces'

/* eslint-disable sonarjs/no-duplicate-string */
const PWD_FIELD_LABEL = 'Contraseña'

export const SIGNUP_FORM_FIELDS = {
  authPersonalData: {
    label: 'Autorizar tratamiento de datos',
    value: 'authPersonalData',
  },
  authTermsAndConditions: {
    label: 'Autorizar términos y condiciones',
    value: 'authTermsAndConditions',
  },
  birthdate: {
    label: 'Fecha de Nacimiento',
    value: 'birthdate',
  },
  confirmEmail: {
    label: 'Confirmar Email',
    value: 'confirmEmail',
  },
  confirmPassword: {
    label: 'Confirmar Contraseña',
    value: 'confirmPassword',
  },
  email: {
    label: 'Email',
    value: 'email',
  },
  firstName: {
    label: 'Primer Nombre',
    value: 'firstName',
  },
  firstSurname: {
    label: 'Primer Apellido',
    value: 'firstSurname',
  },
  identificationNumber: {
    label: 'Número de Identificación',
    value: 'identificationNumber',
  },
  identificationType: {
    label: 'Tipo de Identificación',
    value: 'identificationTypeId',
  },
  password: {
    label: PWD_FIELD_LABEL,
    value: 'password',
  },
  secondName: {
    label: 'Primer Nombre',
    value: 'secondName',
  },
  secondSurname: {
    label: 'Segundo Apellido',
    value: 'secondSurname',
  },
}

export const USER_FORM_FIELDS = {
  birthdate: {
    label: 'Fecha de Nacimiento',
    value: 'birthdate',
  },
  confirmEmail: {
    label: 'Confirmar email',
    value: 'confirmEmail',
  },
  email: {
    label: 'Email',
    value: 'email',
  },
  firstName: {
    label: 'Primer Nombre',
    value: 'firstName',
  },
  firstSurname: {
    label: 'Primer Apellido',
    value: 'firstSurname',
  },
  identificationNumber: {
    label: 'Número de Identificación',
    value: 'identificationNumber',
  },
  identificationType: {
    label: 'Tipo de Identificación',
    value: 'identificationTypeUId',
  },
  roles: {
    label: 'Roles',
    value: 'roles',
  },
  secondName: {
    label: 'Segundo Nombre',
    value: 'secondName',
  },
  secondSurname: {
    label: 'Segundo Apellido',
    value: 'secondSurname',
  },
  status: {
    label: 'Estado',
    value: 'status',
  },
}

export const SIGNIN_FORM_FIELDS = {
  email: {
    label: 'Email',
    value: 'email',
  },
  password: {
    label: PWD_FIELD_LABEL,
    value: 'password',
  },
}

export const FORGOT_PWD_FORM_FIELDS = {
  email: {
    label: 'Email Registrado',
    value: 'email',
  },
}

export const RESET_PWD_FORM_FIELDS = {
  confirmPassword: {
    label: 'Confirmar Nueva Contraseña',
    value: 'confirmPassword',
  },
  password: {
    label: 'Nueva Contraseña',
    value: 'password',
  },
}

export const PERMISSION_FORM_FIELDS = {
  code: {
    label: 'Código',
    value: 'code',
  },
  deletable: {
    label: 'Eliminable',
    value: 'deletable',
  },
  description: {
    label: 'Descripción',
    value: 'description',
  },
  modifiable: {
    label: 'Modificable',
    value: 'modifiable',
  },
  name: {
    label: 'Nombre',
    value: 'name',
  },
  onlyDev: {
    label: 'Tipo de uso',
    value: 'onlyDev',
  },
  preRequired: {
    label: 'Permiso(s) requerido(s)',
    value: 'preRequired',
  },
  type: {
    label: 'Tipo',
    value: 'type',
  },
}

export const MENU_ITEM_FORM_FIELDS = {
  icon: {
    label: 'Icono',
    value: 'icon',
  },
  key: {
    label: 'Key',
    value: 'key',
  },
  label: {
    label: 'Etiqueta',
    value: 'label',
  },
  order: {
    label: 'Orden',
    value: 'order',
  },
  parent: { label: 'Padre', value: 'parent' },
  url: {
    label: 'URL path',
    value: 'url',
  },
}

export const ROUTE_FORM_FIELDS = {
  default: {
    label: 'Por defecto',
    value: 'default',
  },
  description: {
    label: 'Descripción',
    value: 'description',
  },
  menuItem: {
    label: 'Menú',
    value: 'menuItemUId',
  },
  method: {
    label: 'Método',
    value: 'method',
  },
  name: {
    label: 'Nombre',
    value: 'name',
  },
  path: {
    label: 'Path',
    value: 'path',
  },
  permission: {
    label: 'Permiso',
    value: 'permissionUId',
  },
  private: {
    label: 'Privada',
    value: 'private',
  },
}

export const ROLE_FORM_FIELDS = {
  deletable: {
    label: 'Eliminable',
    value: 'deletable',
  },
  description: {
    label: 'Descripción',
    value: 'description',
  },
  modifiable: {
    label: 'Modificable',
    value: 'modifiable',
  },
  name: {
    label: 'Nombre',
    value: 'name',
  },
}

export const TENANT_FORM_FIELDS = {
  status: {
    label: 'Estado',
    value: 'status',
  },
  name: {
    label: 'Nombre',
    value: 'name',
  },
}

export const USER_STATUS_OPTIONS = [
  {
    label: 'Inactivo',
    value: EUserStatus.DISABLED,
  },
  {
    label: 'Activo',
    value: EUserStatus.ENABLED,
  },
]

export const TENANT_USER_STATUS_OPTIONS = [
  {
    label: 'Habilitado',
    value: ETenantUserStatus.ENABLED,
  },
  {
    label: 'Deshabilitado',
    value: ETenantUserStatus.DISABLED,
  },
]

export const CLIENT_FORM_FIELDS = {
  firstName: {
    label: 'Primer Nombre',
    value: 'firstName',
  },
  firstSurname: {
    label: 'Primer Apellido',
    value: 'firstSurname',
  },
  secondSurname: {
    label: 'Segundo Apellido',
    value: 'secondSurname',
  },
  identificationType: {
    label: 'Tipo de Identificación',
    value: 'identificationType',
  },
  identificationNumber: {
    label: 'Número de Identificación',
    value: 'identificationNumber',
  },
  email: {
    label: 'Correo Electrónico',
    value: 'email',
  },
  phoneNumber: {
    label: 'Número de Teléfono',
    value: 'phoneNumber',
  },
  personType: {
    label: 'Tipo de Persona',
    value: 'personType',
  },
  address: {
    label: 'Dirección',
    value: 'address',
  },
  city: {
    label: 'Ciudad',
    value: 'cityUId',
  },
  department: {
    label: 'Departamento',
    value: 'department',
  },
  country: {
    label: 'País',
    value: 'country',
  },
  workCountry: {
    label: 'País de Trabajo',
    value: 'workCountry',
  },
  birthDate: {
    label: 'Fecha de Nacimiento',
    value: 'birthDate',
  },
  ciuCode: {
    label: 'Código CIU',
    value: 'ciuCode',
  },
}

export const CLIENT_RISK_ALERT_FORM_FIELDS = {
  clientUId: {
    label: 'Cliente',
    value: 'clientUId',
  },
  reason: {
    label: 'Motivo',
    value: 'reason',
  },
  notes: {
    label: 'Notas',
    value: 'notes',
  },
  status: {
    label: 'Estado',
    value: 'status',
  },
  resolvedAt: {
    label: 'Fecha de Resolución',
    value: 'resolvedAt',
  },
}

export const LOCATION_FORM_FIELDS = {
  code: {
    label: 'Código',
    value: 'code',
  },
  name: {
    label: 'Nombre',
    value: 'name',
  },
  address: {
    label: 'Dirección',
    value: 'address',
  },
  cityUId: {
    label: 'Ciudad',
    value: 'cityUId',
  },
  additionalDetails: {
    label: 'Detalles Adicionales',
    value: 'additionalDetails',
  },
}
