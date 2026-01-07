import { useSignal } from '@preact/signals-react'
import { useEffect } from 'react'
import { message } from 'antd'

import { type IPaymentMethod, type IPaymentMethodFilters } from '@/interfaces'
import { PaymentMethodsState, paymentMethodsSelectors } from '@/state'
import { paymentMethodsStateActions } from '@/state/paymentMethods/actions'

export const usePaymentMethods = () => {
  const loading = useSignal<{
    list: boolean
    create: boolean
    update: boolean
    delete: boolean
  }>({
    list: false,
    create: false,
    update: false,
    delete: false,
  })

  // Load initial data
  useEffect(() => {
    loadPaymentMethods()
  }, [])

  // Load all payment methods
  const loadPaymentMethods = async () => {
    loading.value = { ...loading.peek(), list: true }
    try {
      await paymentMethodsStateActions.getAllPaymentMethods()
      await paymentMethodsStateActions.getPaymentMethodsPaginated()
    } catch (error) {
      console.error('Error loading payment methods:', error)
      message.error('Error al cargar los métodos de pago')
    } finally {
      loading.value = { ...loading.peek(), list: false }
    }
  }

  // Handle create payment method
  const handleCreatePaymentMethod = async (paymentMethodData: {
    name: string
    description?: string
  }) => {
    loading.value = { ...loading.peek(), create: true }
    try {
      const success =
        await paymentMethodsStateActions.createPaymentMethod(paymentMethodData)
      return success
    } finally {
      loading.value = { ...loading.peek(), create: false }
    }
  }

  // Handle update payment method
  const handleUpdatePaymentMethod = async (paymentMethodData: {
    uid: string
    name?: string
    description?: string
  }) => {
    loading.value = { ...loading.peek(), update: true }
    try {
      const success =
        await paymentMethodsStateActions.updatePaymentMethod(paymentMethodData)
      return success
    } finally {
      loading.value = { ...loading.peek(), update: false }
    }
  }

  // Handle delete payment method
  const handleDeletePaymentMethod = async (uid: string) => {
    loading.value = { ...loading.peek(), delete: true }
    try {
      const success = await paymentMethodsStateActions.deletePaymentMethod(uid)
      return success
    } finally {
      loading.value = { ...loading.peek(), delete: false }
    }
  }

  // Handle edit payment method (open drawer with data)
  const handleEditPaymentMethod = (paymentMethod: IPaymentMethod) => {
    paymentMethodsStateActions.editPaymentMethod(paymentMethod)
  }

  // Handle add payment method (open drawer for new)
  const handleAddPaymentMethod = () => {
    paymentMethodsStateActions.addPaymentMethod()
  }

  // Handle close drawer
  const handleCloseDrawer = () => {
    paymentMethodsStateActions.closeDrawer()
  }

  // Handle pagination change
  const handlePaginationChange = (page: number, pageSize: number) => {
    paymentMethodsStateActions.changePagination(page, pageSize)
    paymentMethodsStateActions.getPaymentMethodsPaginated({
      page,
      limit: pageSize,
      filters: PaymentMethodsState.filters.value,
    })
  }

  // Handle apply filters
  const handleApplyFilters = (filters: IPaymentMethodFilters) => {
    paymentMethodsStateActions.applyFilters(filters)
    paymentMethodsStateActions.getPaymentMethodsPaginated({
      page: 1,
      limit: PaymentMethodsState.pageSize.value,
      filters,
    })
  }

  // Handle clear filters
  const handleClearFilters = async () => {
    try {
      loading.value = { ...loading.peek(), list: true }

      paymentMethodsStateActions.clearFilters()
      await paymentMethodsStateActions.getPaymentMethodsPaginated({
        page: 1,
        limit: PaymentMethodsState.pageSize.value,
        filters: {},
      })
    } finally {
      loading.value = { ...loading.peek(), list: false }
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    loadPaymentMethods()
  }

  return {
    // State
    paymentMethods: PaymentMethodsState.paymentMethods,
    paginatedPaymentMethods: PaymentMethodsState.paginatedPaymentMethods,
    currentPaymentMethod: PaymentMethodsState.currentPaymentMethod,
    openDrawer: PaymentMethodsState.openDrawer,
    editMode: PaymentMethodsState.editMode,
    currentPage: PaymentMethodsState.currentPage,
    pageSize: PaymentMethodsState.pageSize,
    total: PaymentMethodsState.total,
    totalPages: PaymentMethodsState.totalPages,
    filters: PaymentMethodsState.filters,

    // Selectors
    paymentMethodOptions: paymentMethodsSelectors.paymentMethodOptions,
    hasFilters: paymentMethodsSelectors.hasFilters,

    // Loading states
    loading,

    // Actions
    handleCreatePaymentMethod,
    handleUpdatePaymentMethod,
    handleDeletePaymentMethod,
    handleEditPaymentMethod,
    handleAddPaymentMethod,
    handleCloseDrawer,
    handlePaginationChange,
    handleApplyFilters,
    handleClearFilters,
    handleRefresh,
    loadPaymentMethods,
  }
}

// Hook específico para obtener todos los métodos de pago (útil para selects y otras partes)
export const useGetAllPaymentMethods = () => {
  const loading = useSignal(false)

  useEffect(() => {
    const loadAllPaymentMethods = async () => {
      loading.value = true
      try {
        await paymentMethodsStateActions.getAllPaymentMethods()
      } catch (error) {
        console.error('Error loading all payment methods:', error)
        message.error('Error al cargar los métodos de pago')
      } finally {
        loading.value = false
      }
    }

    loadAllPaymentMethods()
  }, [])

  return {
    paymentMethods: PaymentMethodsState.paymentMethods,
    paymentMethodOptions: paymentMethodsSelectors.paymentMethodOptions,
    loading,
  }
}
