import { signal } from '@preact/signals-react'
import type {
  IClientRiskAlert,
  EClientRiskAlertStatus,
  EClientRiskAlertReason,
} from '@/interfaces/client-risk-alerts'

export interface IClientRiskAlertsState {
  currentAlert: ReturnType<typeof signal<IClientRiskAlert>>
  alerts: ReturnType<typeof signal<IClientRiskAlert[]>>
  openDrawer: ReturnType<typeof signal<boolean>>
  loading: ReturnType<typeof signal<boolean>>
  pagination: ReturnType<typeof signal<{
    current: number
    pageSize: number
    total: number
    totalPages: number
  }>>
  filters: ReturnType<typeof signal<{
    status?: EClientRiskAlertStatus
    reason?: EClientRiskAlertReason
    search?: string
    clientUId?: string
  }>>
  submitting: ReturnType<typeof signal<boolean>>
}

const initialState = {
  currentAlert: {} as IClientRiskAlert,
  alerts: [] as IClientRiskAlert[],
  openDrawer: false,
  loading: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  submitting: false,
}

export const ClientRiskAlertsState: IClientRiskAlertsState = {
  currentAlert: signal<IClientRiskAlert>(initialState.currentAlert),
  alerts: signal<IClientRiskAlert[]>(initialState.alerts),
  openDrawer: signal<boolean>(initialState.openDrawer),
  loading: signal<boolean>(initialState.loading),
  pagination: signal(initialState.pagination),
  filters: signal(initialState.filters),
  submitting: signal<boolean>(initialState.submitting),
}