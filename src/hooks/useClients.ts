import { ClientsState } from '@/state/clients/state'
import { clientsStateActions } from '@/state/clients/actions'
import type {
  IClient,
  IClientCreateRequest,
  IClientFindRequest,
} from '@/interfaces/clients'

export const useClients = () => {
  return {
    // State values
    currentClient: ClientsState.currentClient.value,
    searchedClient: ClientsState.searchedClient.value,
    openDrawer: ClientsState.openDrawer.value,
    loading: ClientsState.loading.value,
    searching: ClientsState.searching.value,

    // Actions
    handleOpenDrawer: clientsStateActions.openDrawer,
    handleOpenDrawerWithClient: clientsStateActions.openDrawerWithClient,
    handleCloseDrawer: clientsStateActions.closeDrawer,
    handleClearSearchedClient: clientsStateActions.clearSearchedClient,
    handleCreateClient: (data: IClientCreateRequest) =>
      clientsStateActions.createClient(data),
    handleFindClient: (data: IClientFindRequest) =>
      clientsStateActions.findClient(data),
  }
}
