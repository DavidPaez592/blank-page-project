import { UserOfficesState } from '@/state/userOffices/state'
import { userOfficesActions } from '@/state/userOffices/actions'

export const useUserOffices = () => {
  return {
    // State values
    currentUser: UserOfficesState.currentUser.value,
    assignedOffices: UserOfficesState.assignedOffices.value,
    availableOffices: UserOfficesState.availableOffices.value,
    openDrawer: UserOfficesState.openDrawer.value,
    loading: UserOfficesState.loading.value,

    // Actions
    openManageOfficesDrawer: userOfficesActions.openDrawer,
    closeManageOfficesDrawer: userOfficesActions.closeDrawer,
    assignOfficeToUser: userOfficesActions.assignOffice,
    removeOfficeFromUser: userOfficesActions.removeOffice,
    refreshData: () => {
      userOfficesActions.loadUserOffices()
      userOfficesActions.loadAvailableOffices()
    },
  }
}
