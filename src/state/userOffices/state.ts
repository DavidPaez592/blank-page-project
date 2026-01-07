import { signal } from '@preact/signals-react'

export interface IUserOffice {
  uid: string
  name: string
  code?: string
  assignedAt?: string
}

export interface IOfficeOption {
  uid: string
  name: string
  code?: string
}

export interface IUserOfficesUser {
  uid?: string
  firstName?: string
  firstSurname?: string
  email?: string
}

export interface IUserOfficesState {
  currentUser: IUserOfficesUser
  assignedOffices: IUserOffice[]
  availableOffices: IOfficeOption[]
  openDrawer: boolean
  loading: boolean
}

const initialState: IUserOfficesState = {
  currentUser: {},
  assignedOffices: [],
  availableOffices: [],
  openDrawer: false,
  loading: false,
}

export const UserOfficesState = {
  currentUser: signal(initialState.currentUser),
  assignedOffices: signal(initialState.assignedOffices),
  availableOffices: signal(initialState.availableOffices),
  openDrawer: signal(initialState.openDrawer),
  loading: signal(initialState.loading),
}
