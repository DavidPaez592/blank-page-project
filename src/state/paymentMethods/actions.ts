import { batch } from '@preact/signals-react'
import { message } from 'antd'

import { type IPaymentMethod } from '@/interfaces'
import { PaymentMethodsState } from './index'

import appRequests from '../requests'

export const paymentMethodsStateActions = {
  // Add new payment method
  addPaymentMethod: async () => {
    batch(() => {
      PaymentMethodsState.currentPaymentMethod.value = {
        uid: '',
        name: '',
        description: '',
        createdAt: '',
        updatedAt: '',
      }
      PaymentMethodsState.openDrawer.value = true
      PaymentMethodsState.editMode.value = false
    })
  },

  // Edit existing payment method
  editPaymentMethod: (paymentMethod: IPaymentMethod) => {
    batch(() => {
      PaymentMethodsState.currentPaymentMethod.value = { ...paymentMethod }
      PaymentMethodsState.openDrawer.value = true
      PaymentMethodsState.editMode.value = true
    })
  },

  // Close drawer
  closeDrawer: () => {
    batch(() => {
      PaymentMethodsState.openDrawer.value = false
      PaymentMethodsState.currentPaymentMethod.value = {
        uid: '',
        name: '',
        description: '',
        createdAt: '',
        updatedAt: '',
      }
      PaymentMethodsState.editMode.value = false
    })
  },

  // Create payment method
  createPaymentMethod: async (paymentMethodData: {
    name: string
    description?: string
  }) => {
    try {
      PaymentMethodsState.loading.value = true

      const { data } =
        await appRequests.PaymentMethods.create(paymentMethodData)
      console.log('data', data)
      // Add to the payment methods list
      PaymentMethodsState.paginatedPaymentMethods.value = [
        ...PaymentMethodsState.paginatedPaymentMethods.peek(),
        data.paymentMethod,
      ]

      // Close drawer and show success message
      paymentMethodsStateActions.closeDrawer()
      message.success('Método de pago creado exitosamente')

      // Refresh paginated data
      await paymentMethodsStateActions.getPaymentMethodsPaginated()

      return true
    } catch (error: any) {
      console.error('Error creating payment method:', error)
      message.error(
        error?.response?.data?.message || 'Error al crear el método de pago'
      )
      return false
    } finally {
      PaymentMethodsState.loading.value = false
    }
  },

  // Update payment method
  updatePaymentMethod: async (paymentMethodData: {
    uid: string
    name?: string
    description?: string
  }) => {
    try {
      PaymentMethodsState.loading.value = true

      const { data } =
        await appRequests.PaymentMethods.update(paymentMethodData)

      // Update in paginated data
      const currentPaginatedPaymentMethods =
        PaymentMethodsState.paginatedPaymentMethods.peek()
      const updatedPaginatedPaymentMethods = currentPaginatedPaymentMethods.map(
        (item: IPaymentMethod) =>
          item.uid === data.uid ? { ...item, ...data } : item
      )

      PaymentMethodsState.paginatedPaymentMethods.value =
        updatedPaginatedPaymentMethods

      // Close drawer and show success message
      paymentMethodsStateActions.closeDrawer()
      message.success('Método de pago actualizado exitosamente')

      return true
    } catch (error: any) {
      console.error('Error updating payment method:', error)
      message.error(
        error?.response?.data?.message ||
          'Error al actualizar el método de pago'
      )
      return false
    } finally {
      PaymentMethodsState.loading.value = false
    }
  },

  // Delete payment method
  deletePaymentMethod: async (uid: string) => {
    try {
      PaymentMethodsState.loading.value = true

      await appRequests.PaymentMethods.delete({ uid })

      // Remove from paginated data
      const currentPaginatedPaymentMethods =
        PaymentMethodsState.paginatedPaymentMethods.peek()
      const filteredPaginatedPaymentMethods =
        currentPaginatedPaymentMethods.filter(
          (item: IPaymentMethod) => item.uid !== uid
        )

      PaymentMethodsState.paginatedPaymentMethods.value =
        filteredPaginatedPaymentMethods

      // Update total count
      PaymentMethodsState.total.value = PaymentMethodsState.total.peek() - 1

      message.success('Método de pago eliminado exitosamente')

      // If current page is empty and not the first page, go to previous page
      if (
        filteredPaginatedPaymentMethods.length === 0 &&
        PaymentMethodsState.currentPage.peek() > 1
      ) {
        const previousPage = PaymentMethodsState.currentPage.peek() - 1
        PaymentMethodsState.currentPage.value = previousPage
        await paymentMethodsStateActions.getPaymentMethodsPaginated()
      }

      return true
    } catch (error: any) {
      console.error('Error deleting payment method:', error)
      message.error(
        error?.response?.data?.message || 'Error al eliminar el método de pago'
      )
      return false
    } finally {
      PaymentMethodsState.loading.value = false
    }
  },

  // Get all payment methods
  getAllPaymentMethods: async () => {
    try {
      PaymentMethodsState.loading.value = true
      const response = await appRequests.PaymentMethods.getAll()
      PaymentMethodsState.paymentMethods.value = response.data
    } catch (error: any) {
      console.error('Error loading all payment methods:', error)
      message.error(
        error?.response?.data?.message || 'Error al cargar los métodos de pago'
      )
    } finally {
      PaymentMethodsState.loading.value = false
    }
  },

  // Get paginated payment methods
  getPaymentMethodsPaginated: async (options?: {
    page?: number
    limit?: number
    filters?: {
      name?: string
      search?: string
    }
  }) => {
    try {
      PaymentMethodsState.loading.value = true

      const currentPage =
        options?.page || PaymentMethodsState.currentPage.peek()
      const currentPageSize =
        options?.limit || PaymentMethodsState.pageSize.peek()
      const currentFilters =
        options?.filters || PaymentMethodsState.filters.peek()

      const response = await appRequests.PaymentMethods.getPaginated({
        page: currentPage,
        limit: currentPageSize,
        filters: currentFilters,
      })

      batch(() => {
        PaymentMethodsState.paginatedPaymentMethods.value =
          response.data.paymentMethods
        PaymentMethodsState.total.value = response.data.count
        PaymentMethodsState.currentPage.value = response.data.page
        PaymentMethodsState.pageSize.value = response.data.limit
        PaymentMethodsState.totalPages.value = Math.ceil(
          response.data.count / response.data.limit
        )
      })
    } catch (error: any) {
      console.error('Error loading paginated payment methods:', error)
      message.error(
        error?.response?.data?.message || 'Error al cargar los métodos de pago'
      )
    } finally {
      PaymentMethodsState.loading.value = false
    }
  },

  // Change pagination
  changePagination: (page: number, pageSize: number) => {
    batch(() => {
      PaymentMethodsState.currentPage.value = page
      PaymentMethodsState.pageSize.value = pageSize
    })
  },

  // Apply filters
  applyFilters: (filters: { name?: string; search?: string }) => {
    batch(() => {
      PaymentMethodsState.filters.value = filters
      PaymentMethodsState.currentPage.value = 1 // Reset to first page when filtering
    })
  },

  // Clear filters
  clearFilters: () => {
    batch(() => {
      PaymentMethodsState.filters.value = {}
      PaymentMethodsState.currentPage.value = 1
    })
  },
}
