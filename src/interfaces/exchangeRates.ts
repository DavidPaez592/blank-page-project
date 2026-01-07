/**
 * Exchange Rates interfaces and types
 * Updated to match API documentation
 */

// Base ExchangeRate interface
export interface IExchangeRate {
  uid: string
  officeUId: string
  currencyUId: string
  paymentMethodUId: string
  purchasePrice: string
  salePrice: string
  trm: string
  date: string
  createdAt: string
  updatedAt: string
  office: {
    uid: string
    name: string
  }
  currency: {
    uid: string
    name: string
    code: string
    symbol: string
  }
  paymentMethod: {
    uid: string
    name: string
    description: string
  }
}

export interface IExchangeRateCreateRequest {
  officeUId: string
  currencyUId: string
  paymentMethodUId: string
  purchasePrice: string | number
  salePrice: string | number
  trm: string | number
  date: string
}

export interface IExchangeRateUpdateRequest {
  uid: string
  purchasePrice?: string | number
  salePrice?: string | number
  trm?: string | number
  date?: string
}

export interface IExchangeRateDeleteRequest {
  uid: string
}

export interface IExchangeRatesGetAllResponse {
  success: boolean
  data: IExchangeRate[]
  message: string
}

export interface IExchangeRatesPaginatedResponse {
  exchangeRates: IExchangeRate[]
  total: number
  page: number
  limit: number
}

export interface IExchangeRateCreateResponse extends IExchangeRate {}

export interface IExchangeRateUpdateResponse extends IExchangeRate {}

export interface IExchangeRateDeleteResponse {
  success: boolean
  message: string
}

export interface IExchangeRatesErrorResponse {
  success: boolean
  message: string
  error?: string
}

export interface IExchangeRateFilters {
  date: string // Required
  officeUId: string // Required
  currencyUId?: string // Optional
  paymentMethodUId?: string // Optional
}

export interface IExchangeRatePaginationOptions {
  date: string // Required
  officeUId: string // Required
  currencyUId?: string // Optional
  paymentMethodUId?: string // Optional
  page?: number
  limit?: number
}

export interface IExchangeRateTableData extends IExchangeRate {
  key: string
}

export interface IExchangeRateBulkUploadRequest {
  date: string // YYYY-MM-DD format - Required
  officeUId: string
  file: File
}

export interface IExchangeRateBulkUploadResponse {
  success: number
  failed: number
  total: number
  successItems: Array<{
    data: IExchangeRate
    row: number
    success: boolean
    message: string
  }>
  failedItems: Array<{
    data: {
      codigo: string
      metodo_pago: string
      precio_compra: number
      precio_venta: number
      trm: number
    }
    row: number
    success: boolean
    message: string
  }>
}
