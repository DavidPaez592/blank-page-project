import { message } from 'antd'
import { OfficesState } from './index'
import officesRequests from './requests'

export const officesStateActions = {
  getAllOffices: async (): Promise<void> => {
    try {
      const response = await officesRequests.getAll()

      OfficesState.offices.value = response.data
    } catch (error) {
      console.error('Error loading offices:', error)
      message.error('Error al cargar las oficinas')
      throw error
    }
  },
}
