import { type Signal } from '@preact/signals-react'

/**
 * Cliente - Información básica del cliente
 */
export interface IClient {
  uid?: string
  tenantClientUId?: string
  identificationTypeUId?: string
  identificationNumber?: string
  verificationDigit?: string | null
  personTypeUId?: string
  firstName?: string
  secondName?: string | null
  firstSurname?: string
  secondSurname?: string | null
  fullName?: string
  birthDate?: string | null
  birthPlace?: string | null
  nationalityUId?: string | null
  isPep?: boolean
  address?: string | null
  cityUId?: string | null
  phone1?: string | null
  phone2?: string | null
  email?: string | null
  occupation?: string | null
  ciuUId?: string | null
  workAddress?: string | null
  workCityUId?: string | null
  workCountryUId?: string | null
  code?: string | null
  branchOffice?: string | null
  legalRepresentative?: string | null
  legalRepresentativeUId?: string | null
  subscribedCapital?: number | null
  additionalData?: string | null
  status?: string
  createdAt?: string
  updatedAt?: string
  // Shareholders (composición accionaria)
  shareholders?: Array<{
    uid?: string
    documentTypeUId?: string
    documentNumber?: string
    firstName?: string
    secondName?: string | null
    firstSurname?: string
    secondSurname?: string | null
    percentage?: string | number
    isPep?: boolean
    createdAt?: string
    updatedAt?: string
  }>
  // Relaciones expandidas
  identificationType?: {
    uid: string
    label: string
  }
  personType?: {
    uid: string
    name: string
  }
  nationality?: {
    uid: string
    name: string
    dianCode: string
  }
  city?: {
    uid: string
    name: string
    dianCode: string
    departmentName: string
    departmentCode: string
  } | null
  workCountry?: {
    uid: string
    name: string
    dianCode: string
  }
  workCity?: {
    uid: string
    name: string
    dianCode: string
    departmentName: string
    departmentCode: string
  }
  ciu?: {
    uid: string
    dianCode: string
    description: string
  }
}

/**
 * Request para crear un nuevo cliente
 */
export interface IClientCreateRequest {
  // Campos de identificación
  identificationTypeUId: string
  identificationNumber: string
  verificationDigit?: string | null
  personTypeUId: string

  // Campos de nombre
  firstName: string
  secondName?: string | null
  firstSurname: string
  secondSurname?: string | null

  // Campos de datos personales
  birthDate?: string | null
  birthPlace?: string | null
  nationalityUId?: string | null
  isPep: boolean

  // Campos de ubicación
  address?: string | null
  cityUId?: string | null

  // Campos de contacto
  phone1?: string | null
  phone2?: string | null
  email?: string | null

  // Campos de trabajo
  occupation?: string | null
  ciuUId?: string | null
  workAddress?: string | null
  workCityUId?: string | null
  workCountryUId?: string | null

  // Campos adicionales
  code?: string | null
  branchOffice?: string | null
  legalRepresentative?: string | null
  subscribedCapital?: number | null
  additionalData?: string | null
}

/**
 * Request para buscar un cliente por identificación
 */
export interface IClientFindRequest {
  identificationTypeUId: string
  identificationNumber: string
}

/**
 * Respuesta al crear un cliente
 */
export interface IClientCreateResponse {
  message: string
  client: IClient
}

/**
 * Respuesta al buscar un cliente
 */
export interface IClientFindResponse extends IClient {}

/**
 * Respuesta de error
 */
export interface IClientErrorResponse {
  message: string
  error?: string
  statusCode: number
}

/**
 * Estado del módulo de clientes
 */
export interface IClientsState {
  currentClient: Signal<IClient>
  searchedClient: Signal<IClient | null>
  openDrawer: Signal<boolean>
  loading: Signal<boolean>
  searching: Signal<boolean>
  identificationTypes: Signal<any[]>
  personTypes: Signal<any[]>
  countries: Signal<any[]>
  cities: Signal<any[]>
  cius: Signal<any[]>
}

/**
 * Opciones para tipos de identificación
 */
export interface IIdentificationTypeOption {
  label: string
  value: string
}

/**
 * Opciones para tipos de persona
 */
export interface IPersonTypeOption {
  label: string
  value: string
}

/**
 * Opciones para países
 */
export interface ICountryOption {
  label: string
  value: string
}

/**
 * Opciones para departamentos
 */
export interface IDepartmentOption {
  label: string
  value: string
}

/**
 * Opciones para ciudades
 */
export interface ICityOption {
  label: string
  value: string
}

/**
 * Opciones para CIUs
 */
export interface ICiuOption {
  label: string
  value: string
}
