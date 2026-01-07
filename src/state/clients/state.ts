import { signal } from '@preact/signals-react'
import type { IClient, IClientsState } from '@/interfaces/clients'

const initialState = {
  currentClient: {},
  searchedClient: null,
  openDrawer: false,
  loading: false,
  searching: false,
  identificationTypes: [],
  personTypes: [],
  countries: [],
  cities: [],
  cius: [],
}

export const ClientsState: IClientsState = {
  currentClient: signal<IClient>(initialState.currentClient),
  searchedClient: signal<IClient | null>(initialState.searchedClient),
  openDrawer: signal<boolean>(initialState.openDrawer),
  loading: signal<boolean>(initialState.loading),
  searching: signal<boolean>(initialState.searching),
  identificationTypes: signal<any[]>(initialState.identificationTypes),
  personTypes: signal<any[]>(initialState.personTypes),
  countries: signal<any[]>(initialState.countries),
  cities: signal<any[]>(initialState.cities),
  cius: signal<any[]>(initialState.cius),
}
