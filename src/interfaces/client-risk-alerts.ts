// Client Risk Alert Status enum
export enum EClientRiskAlertStatus {
  Active = 'active',
  UnderReview = 'under_review',
  ResolvedFalsePositive = 'resolved_false_positive',
  ResolvedConfirmed = 'resolved_confirmed',
}

// Client Risk Alert Reason enum
export enum EClientRiskAlertReason {
  UnusualTransactionPattern = 'unusual_transaction_pattern',
  DocumentInconsistency = 'document_inconsistency',  
  SanctionListMatchInternal = 'sanction_list_match_internal',
  ReportedFraudAttempt = 'reported_fraud_attempt',
  Other = 'other',
}

// Base interface for Client Risk Alert
export interface IClientRiskAlert {
  uid: string
  clientUId: string
  client?: {
    uid: string
    identificationNumber: string
    firstName: string
    firstSurname: string
    fullName?: string
  }
  reportingTenantUId: string
  reportingTenant?: {
    uid: string
    name: string
  }
  reason: EClientRiskAlertReason
  notes?: string | null
  status: EClientRiskAlertStatus
  resolvedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

// Create Client Risk Alert Request
export interface IClientRiskAlertCreateRequest {
  clientUId: string
  reason: EClientRiskAlertReason
  notes?: string
  status?: EClientRiskAlertStatus
}

// Update Client Risk Alert Request
export interface IClientRiskAlertUpdateRequest {
  uid: string
  reason?: EClientRiskAlertReason
  notes?: string
  status?: EClientRiskAlertStatus
  resolvedAt?: string | null
}

// Delete Client Risk Alert Request
export interface IClientRiskAlertDeleteRequest {
  uid: string
}

// Get Client Risk Alert Details Request
export interface IClientRiskAlertDetailRequest {
  uid: string
}

// Client Risk Alert List Response
export interface IClientRiskAlertListResponse {
  page: number
  limit: number
  alerts: IClientRiskAlert[]
  total: number
  totalPages: number
}

// Client Risk Alert Create Response
export interface IClientRiskAlertCreateResponse {
  message: string
  data: IClientRiskAlert
}

// Client Risk Alert Update Response
export interface IClientRiskAlertUpdateResponse {
  message: string
  data: IClientRiskAlert
}

// Client Risk Alert Delete Response
export interface IClientRiskAlertDeleteResponse {
  message: string
}

// Get All Client Risk Alerts Response
export interface IClientRiskAlertGetAllResponse {
  data: IClientRiskAlert[]
}

// List options for Client Risk Alerts
export interface IClientRiskAlertListOptions {
  limit?: number
  page?: number
  status?: EClientRiskAlertStatus
  clientUId?: string
}

// Get All options for Client Risk Alerts
export interface IClientRiskAlertGetAllOptions {
  status?: EClientRiskAlertStatus
  search?: string
}

// Client Risk Alert Filters
export interface IClientRiskAlertFilters {
  status?: EClientRiskAlertStatus
  reason?: EClientRiskAlertReason
  search?: string
  clientUId?: string
}