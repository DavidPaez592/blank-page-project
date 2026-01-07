import { notification } from 'antd'
import { UserOfficesState } from './state'
import userOfficesRequests from './requests'
import type { IUser } from '../../interfaces'

export const userOfficesActions = {
  setCurrentUser: (user: IUser) => {
    UserOfficesState.currentUser.value = {
      uid: user.uid,
      firstName: user.firstName,
      firstSurname: user.firstSurname,
      email: user.email,
    }
  },

  openDrawer: (user: IUser) => {
    userOfficesActions.setCurrentUser(user)
    UserOfficesState.openDrawer.value = true
    userOfficesActions.loadUserOffices()
    userOfficesActions.loadAvailableOffices()
  },

  closeDrawer: () => {
    UserOfficesState.openDrawer.value = false
    UserOfficesState.currentUser.value = {}
    UserOfficesState.assignedOffices.value = []
    UserOfficesState.availableOffices.value = []
  },

  loadAvailableOffices: async () => {
    try {
      UserOfficesState.loading.value = true
      const { data } = await userOfficesRequests.listAllOffices()
      UserOfficesState.availableOffices.value = data.map((office: any) => ({
        uid: office.uid,
        name: office.name,
        code: office.code,
      }))
    } catch (error) {
      console.error('Error loading available offices:', error)
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar las oficinas disponibles',
      })
    } finally {
      UserOfficesState.loading.value = false
    }
  },

  loadUserOffices: async () => {
    const userUid = UserOfficesState.currentUser.value.uid
    if (!userUid) return

    try {
      UserOfficesState.loading.value = true
      const { data } = await userOfficesRequests.listUserOffices({
        uid: userUid,
      })
      UserOfficesState.assignedOffices.value = data.map((office: any) => ({
        uid: office.uid,
        name: office.name,
        code: office.code,
        assignedAt: office.assignedAt,
      }))
    } catch (error) {
      console.error('Error loading user offices:', error)
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar las oficinas del usuario',
      })
    } finally {
      UserOfficesState.loading.value = false
    }
  },

  assignOffice: async (officeUid: string) => {
    const userUid = UserOfficesState.currentUser.value.uid
    if (!userUid) return

    try {
      UserOfficesState.loading.value = true
      await userOfficesRequests.assignOfficeToUser({
        uid: userUid,
        officeUId: officeUid,
      })

      notification.success({
        message: 'Éxito',
        description: 'Oficina asignada correctamente',
      })

      // Reload both lists to reflect changes
      await userOfficesActions.loadUserOffices()
      await userOfficesActions.loadAvailableOffices()
    } catch (error) {
      console.error('Error assigning office:', error)
      notification.error({
        message: 'Error',
        description: 'No se pudo asignar la oficina',
      })
    } finally {
      UserOfficesState.loading.value = false
    }
  },

  removeOffice: async (officeUid: string) => {
    const userUid = UserOfficesState.currentUser.value.uid
    if (!userUid) return

    try {
      UserOfficesState.loading.value = true
      await userOfficesRequests.removeOfficeFromUser({
        uid: userUid,
        officeUId: officeUid,
      })

      notification.success({
        message: 'Éxito',
        description: 'Oficina removida correctamente',
      })

      // Reload both lists to reflect changes
      await userOfficesActions.loadUserOffices()
      await userOfficesActions.loadAvailableOffices()
    } catch (error) {
      console.error('Error removing office:', error)
      notification.error({
        message: 'Error',
        description: 'No se pudo remover la oficina',
      })
    } finally {
      UserOfficesState.loading.value = false
    }
  },
}
