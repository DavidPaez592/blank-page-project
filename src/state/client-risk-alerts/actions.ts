import { notification } from 'antd'
import { ClientRiskAlertsState } from './state'
import clientRiskAlertsRequests from './requests'
import type {
  IClientRiskAlert,
  IClientRiskAlertCreateRequest,
  IClientRiskAlertUpdateRequest,
  IClientRiskAlertListOptions,
  IClientRiskAlertGetAllOptions,
  EClientRiskAlertStatus,
  EClientRiskAlertReason,
} from '@/interfaces/client-risk-alerts'

export const clientRiskAlertsStateActions = {
  /**
   * Abrir el drawer para crear una nueva alerta
   */
  openDrawer: (clientUId?: string) => {
    ClientRiskAlertsState.currentAlert.value = {
      clientUId: clientUId || '',
    } as IClientRiskAlert
    ClientRiskAlertsState.openDrawer.value = true
  },

  /**
   * Abrir el drawer con una alerta existente (para edición)
   */
  openDrawerWithAlert: (alert: IClientRiskAlert) => {
    ClientRiskAlertsState.currentAlert.value = alert
    ClientRiskAlertsState.openDrawer.value = true
  },

  /**
   * Cerrar el drawer
   */
  closeDrawer: () => {
    ClientRiskAlertsState.openDrawer.value = false
    ClientRiskAlertsState.currentAlert.value = {} as IClientRiskAlert
  },

  /**
   * Obtener lista paginada de alertas de riesgo
   */
  getList: async (options?: IClientRiskAlertListOptions): Promise<boolean> => {
    try {
      ClientRiskAlertsState.loading.value = true
      
      const requestOptions = {
        limit: options?.limit || ClientRiskAlertsState.pagination.value?.pageSize || 10,
        page: options?.page || ClientRiskAlertsState.pagination.value?.current || 1,
        status: options?.status || ClientRiskAlertsState.filters.value?.status,
        clientUId: options?.clientUId || ClientRiskAlertsState.filters.value?.clientUId,
      }

      const response = await clientRiskAlertsRequests.list(requestOptions)

      if (response && response.data) {
        ClientRiskAlertsState.alerts.value = response.data.alerts || []
        ClientRiskAlertsState.pagination.value = {
          current: response.data.page || 1,
          pageSize: response.data.limit || 10,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
        }
        return true
      }

      return false
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'No se pudieron cargar las alertas de riesgo'

      notification.error({
        message: 'Error al cargar alertas',
        description: errorMessage,
        duration: 5,
      })

      ClientRiskAlertsState.alerts.value = []
      return false
    } finally {
      ClientRiskAlertsState.loading.value = false
    }
  },

  /**
   * Obtener todas las alertas sin paginación
   */
  getAll: async (options?: IClientRiskAlertGetAllOptions): Promise<IClientRiskAlert[]> => {
    try {
      const response = await clientRiskAlertsRequests.getAll(options)
      
      if (response && response.data) {
        return response.data.data || []
      }

      return []
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'No se pudieron cargar las alertas de riesgo'

      notification.error({
        message: 'Error al cargar alertas',
        description: errorMessage,
        duration: 5,
      })

      return []
    }
  },

  /**
   * Obtener detalles de una alerta específica
   */
  getDetail: async (uid: string): Promise<IClientRiskAlert | null> => {
    try {
      const response = await clientRiskAlertsRequests.getDetail({ uid })
      
      if (response && response.data) {
        return response.data
      }

      return null
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'No se pudieron cargar los detalles de la alerta'

      notification.error({
        message: 'Error al cargar detalles',
        description: errorMessage,
        duration: 5,
      })

      return null
    }
  },

  /**
   * Crear una nueva alerta de riesgo
   */
  create: async (data: IClientRiskAlertCreateRequest): Promise<boolean> => {
    try {
      ClientRiskAlertsState.submitting.value = true
      const response = await clientRiskAlertsRequests.create(data)

      notification.success({
        message: 'Alerta creada exitosamente',
        description: 'La alerta de riesgo ha sido creada correctamente.',
        duration: 4,
      })

      clientRiskAlertsStateActions.closeDrawer()
      // Recargar la lista de alertas
      await clientRiskAlertsStateActions.getList()

      return true
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'No se pudo crear la alerta de riesgo'

      notification.error({
        message: 'Error al crear alerta',
        description: errorMessage,
        duration: 5,
      })

      return false
    } finally {
      ClientRiskAlertsState.submitting.value = false
    }
  },

  /**
   * Actualizar una alerta existente
   */
  update: async (
    uid: string,
    data: Omit<IClientRiskAlertUpdateRequest, 'uid'>
  ): Promise<boolean> => {
    try {
      ClientRiskAlertsState.submitting.value = true
      const response = await clientRiskAlertsRequests.update({ ...data, uid })

      notification.success({
        message: 'Alerta actualizada exitosamente',
        description: 'La alerta de riesgo ha sido actualizada correctamente.',
        duration: 4,
      })

      clientRiskAlertsStateActions.closeDrawer()
      // Recargar la lista de alertas
      await clientRiskAlertsStateActions.getList()

      return true
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'No se pudo actualizar la alerta de riesgo'

      notification.error({
        message: 'Error al actualizar alerta',
        description: errorMessage,
        duration: 5,
      })

      return false
    } finally {
      ClientRiskAlertsState.submitting.value = false
    }
  },

  /**
   * Eliminar una alerta de riesgo
   */
  delete: async (uid: string): Promise<boolean> => {
    try {
      const response = await clientRiskAlertsRequests.delete({ uid })

      notification.success({
        message: 'Alerta eliminada exitosamente',
        description: 'La alerta de riesgo ha sido eliminada correctamente.',
        duration: 4,
      })

      // Recargar la lista de alertas
      await clientRiskAlertsStateActions.getList()

      return true
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'No se pudo eliminar la alerta de riesgo'

      notification.error({
        message: 'Error al eliminar alerta',
        description: errorMessage,
        duration: 5,
      })

      return false
    }
  },

  /**
   * Actualizar filtros
   */
  updateFilters: (filters: {
    status?: EClientRiskAlertStatus
    reason?: EClientRiskAlertReason
    search?: string
    clientUId?: string
  }) => {
    ClientRiskAlertsState.filters.value = { ...ClientRiskAlertsState.filters.value, ...filters }
  },

  /**
   * Limpiar filtros
   */
  clearFilters: () => {
    ClientRiskAlertsState.filters.value = {}
  },

  /**
   * Cambiar página
   */
  changePage: async (page: number, pageSize?: number) => {
    const currentPagination = ClientRiskAlertsState.pagination.value || {
      current: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    }
    
    const newPagination = {
      ...currentPagination,
      current: page,
      pageSize: pageSize || currentPagination.pageSize,
    }
    
    ClientRiskAlertsState.pagination.value = newPagination
    
    await clientRiskAlertsStateActions.getList({
      page,
      limit: pageSize || currentPagination.pageSize,
    })
  },
}