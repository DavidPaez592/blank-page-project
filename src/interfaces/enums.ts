export const enum EUserStatus {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
}

export const enum EPersonalIdentificationType {
  CEDULA_CIUDADANIA = 'cedula_ciudadania',
  CEDULA_EXTRANJERIA = 'cedula_extranjeria',
  NIT = 'nit',
  PASAPORTE = 'pasaporte',
}

export const enum EOTPStatus {
  APPROVED = 'approved',
  ENABLED = 'enabled',
}

export const enum EPermissionType {
  DATA = 'data',
  ROUTE = 'route',
  VIEW = 'view',
}

export const enum ERouteMethod {
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}

export const enum EUserCodeTypes {
  FORGOT_PASSWORD = 'forgotPassword',
  REGISTER = 'register',
  RESET_PASSWORD = 'resetPassword',
}

export const enum ETenantStatus {
  Active = 'active',
  Suspended = 'suspended',
  PendingSetup = 'pending_setup',
}

export const enum ETenantUserStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}
