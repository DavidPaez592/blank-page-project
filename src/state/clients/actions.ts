import { notification } from 'antd'
import { ClientsState } from './state'
import clientsRequests from './requests'
import type {
  IClient,
  IClientCreateRequest,
  IClientFindRequest,
} from '@/interfaces/clients'

export const clientsStateActions = {
  /**
   * Resetear todo el estado de clientes (usar al cerrar sesión)
   */
  resetState: () => {
    ClientsState.currentClient.value = {}
    ClientsState.searchedClient.value = null
    ClientsState.openDrawer.value = false
    ClientsState.loading.value = false
    ClientsState.searching.value = false
    ClientsState.identificationTypes.value = []
    ClientsState.personTypes.value = []
    ClientsState.countries.value = []
    ClientsState.cities.value = []
    ClientsState.cius.value = []
  },

  /**
   * Abrir el drawer para crear un nuevo cliente
   */
  openDrawer: () => {
    ClientsState.currentClient.value = {}
    ClientsState.openDrawer.value = true
  },

  /**
   * Abrir el drawer con un cliente existente (para edición futura)
   */
  openDrawerWithClient: (client: IClient) => {
    ClientsState.currentClient.value = client
    ClientsState.openDrawer.value = true
  },

  /**
   * Cerrar el drawer
   */
  closeDrawer: () => {
    ClientsState.openDrawer.value = false
    ClientsState.currentClient.value = {}
  },

  /**
   * Limpiar el cliente buscado
   */
  clearSearchedClient: () => {
    ClientsState.searchedClient.value = null
  },

  /**
   * Crear un nuevo cliente
   */
  createClient: async (data: IClientCreateRequest): Promise<boolean> => {
    try {
      ClientsState.loading.value = true
      const response = await clientsRequests.createClient(data)

      notification.success({
        message: 'Cliente creado exitosamente',
        description: `El cliente ${data.firstName} ${data.firstSurname} ha sido creado correctamente.`,
        duration: 4,
      })

      ClientsState.currentClient.value = response.data.client
      clientsStateActions.closeDrawer()

      return true
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'No se pudo crear el cliente'

      notification.error({
        message: 'Error al crear cliente',
        description: errorMessage,
        duration: 5,
      })

      return false
    } finally {
      ClientsState.loading.value = false
    }
  },

  /**
   * Actualizar un cliente existente
   */
  updateClient: async (
    uid: string,
    data: IClientCreateRequest
  ): Promise<boolean> => {
    try {
      ClientsState.loading.value = true
      const response = await clientsRequests.updateClient(uid, data)

      notification.success({
        message: 'Cliente actualizado exitosamente',
        description: `El cliente ${data.firstName} ${data.firstSurname} ha sido actualizado correctamente.`,
        duration: 4,
      })

      ClientsState.currentClient.value = response.data.client
      ClientsState.searchedClient.value = response.data.client
      clientsStateActions.closeDrawer()

      return true
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'No se pudo actualizar el cliente'

      notification.error({
        message: 'Error al actualizar cliente',
        description: errorMessage,
        duration: 5,
      })

      return false
    } finally {
      ClientsState.loading.value = false
    }
  },

  /**
   * Buscar un cliente por identificación
   */
  findClient: async (data: IClientFindRequest): Promise<IClient | null> => {
    try {
      ClientsState.searching.value = true
      const response = await clientsRequests.findClient(data)
      if (response && response.data) {
        ClientsState.searchedClient.value = response.data

        notification.success({
          message: 'Cliente encontrado',
          description: `Cliente: ${response.data.fullName || response.data.firstName + ' ' + response.data.firstSurname}`,
          duration: 3,
        })

        return response.data
      } else {
        ClientsState.searchedClient.value = null

        notification.info({
          message: 'Cliente no encontrado',
          description:
            'No se encontró un cliente con la identificación proporcionada.',
          duration: 3,
        })

        return null
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'No se pudo buscar el cliente'

      notification.error({
        message: 'Error al buscar cliente',
        description: errorMessage,
        duration: 5,
      })

      ClientsState.searchedClient.value = null
      return null
    } finally {
      ClientsState.searching.value = false
    }
  },

  /**
   * Cargar tipos de identificación
   */
  getIdentificationTypes: async (): Promise<any[]> => {
    try {
      const response = await clientsRequests.getIdentificationTypes()
      ClientsState.identificationTypes.value = response.data || []
      return response.data || []
    } catch (error) {
      ClientsState.identificationTypes.value = []
      return []
    }
  },

  /**
   * Cargar tipos de persona
   */
  getPersonTypes: async (): Promise<any[]> => {
    try {
      const response = await clientsRequests.getPersonTypes()
      ClientsState.personTypes.value = response.data || []
      return response.data || []
    } catch (error) {
      ClientsState.personTypes.value = []
      return []
    }
  },

  /**
   * Cargar países
   */
  getCountries: async (search?: string): Promise<any[]> => {
    try {
      const response = await clientsRequests.getCountries(search)
      ClientsState.countries.value = response.data || []
      return response.data || []
    } catch (error) {
      ClientsState.countries.value = []
      return []
    }
  },

  /**
   * Cargar ciudades
   */
  getCities: async (search?: string): Promise<any[]> => {
    try {
      const response = await clientsRequests.getCities(search)
      ClientsState.cities.value = response.data || []
      return response.data || []
    } catch (error) {
      ClientsState.cities.value = []
      return []
    }
  },

  /**
   * Cargar CIUs
   */
  getCius: async (search?: string): Promise<any[]> => {
    try {
      const response = await clientsRequests.getCius(search)
      ClientsState.cius.value = response.data || []
      return response.data || []
    } catch (error) {
      ClientsState.cius.value = []
      return []
    }
  },
}
