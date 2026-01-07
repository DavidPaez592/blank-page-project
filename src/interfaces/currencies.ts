/**
 * Currency interfaces and types
 */

// Base Currency interface
export interface ICurrency {
  uid: string
  name: string
  code: string
  symbol: string
  createdAt: string
  updatedAt: string
}

// Currency creation request
export interface ICurrencyCreateRequest {
  name: string
  code: string
  symbol: string
}

// Currency update request
export interface ICurrencyUpdateRequest {
  uid: string
  name?: string
  code?: string
  symbol?: string
}

// Currency delete request
export interface ICurrencyDeleteRequest {
  uid: string
}

// API Response types
export interface ICurrenciesGetAllResponse extends ICurrency {}

export interface ICurrenciesPaginatedResponse {
  currencies: ICurrency[]
  total: number
  page: number
  limit: number
  totalPages: number
  message: string
}

export interface ICurrencyRetrieveResponse {
  data: ICurrency
  message: string
}

export interface ICurrencyCreateResponse extends ICurrency {}

export interface ICurrencyUpdateResponse extends ICurrency {}

export interface ICurrencyDeleteResponse {
  message: string
}

export interface ICurrenciesErrorResponse {
  message: string
  error: string
  statusCode: number
}

// Filter and pagination options
export interface ICurrencyFilters {
  name?: string
  code?: string
  search?: string
}

export interface ICurrencyPaginationOptions {
  page?: number
  limit?: number
  filters?: ICurrencyFilters
}

// Table column interface for Ant Design
export interface ICurrencyTableData extends ICurrency {
  key: string
}
