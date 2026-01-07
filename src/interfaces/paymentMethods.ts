/**
 * Payment Methods interfaces and types
 */

// Base PaymentMethod interface
export interface IPaymentMethod {
  uid: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

// PaymentMethod creation request
export interface IPaymentMethodCreateRequest {
  name: string
  description?: string
}

// PaymentMethod update request
export interface IPaymentMethodUpdateRequest {
  uid: string
  name?: string
  description?: string
}

// Payment method delete request
export interface IPaymentMethodDeleteRequest {
  uid: string
}

// API Response types
export interface IPaymentMethodsGetAllResponse extends IPaymentMethod {}

export interface IPaymentMethodsPaginatedResponse {
  paymentMethods: IPaymentMethod[]
  count: number
  page: number
  limit: number
}

export interface IPaymentMethodCreateResponse {
  message: string
  paymentMethod: IPaymentMethod
}

export interface IPaymentMethodUpdateResponse extends IPaymentMethod {}

export interface IPaymentMethodDeleteResponse {
  message: string
}

export interface IPaymentMethodsErrorResponse {
  message: string
  error: string
  statusCode: number
}

// Filter and pagination options
export interface IPaymentMethodFilters {
  name?: string
  search?: string
}

export interface IPaymentMethodPaginationOptions {
  page?: number
  limit?: number
  filters?: IPaymentMethodFilters
}

// Table column interface for Ant Design
export interface IPaymentMethodTableData extends IPaymentMethod {
  key: string
}
