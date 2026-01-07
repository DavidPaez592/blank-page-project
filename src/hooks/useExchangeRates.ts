import { useSignal } from '@preact/signals-react'

import { type IExchangeRate, type IExchangeRateFilters } from '@/interfaces'
import { ExchangeRatesState, exchangeRatesSelectors } from '@/state'
import { exchangeRatesStateActions } from '@/state/exchangeRates/actions'

export const useExchangeRates = () => {
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

  const loadExchangeRates = async () => {
    loading.value = { ...loading.peek(), list: true }
    try {
      await exchangeRatesStateActions.getExchangeRatesPaginated()
    } catch (error) {
      console.error('Error loading exchange rates:', error)
    } finally {
      loading.value = { ...loading.peek(), list: false }
    }
  }

  const handleCreateExchangeRate = async (exchangeRateData: {
    officeUId: string
    currencyUId: string
    paymentMethodUId: string
    purchasePrice: string | number
    salePrice: string | number
    trm: string | number
    date: string
  }): Promise<boolean> => {
    loading.value = { ...loading.peek(), create: true }
    try {
      return await exchangeRatesStateActions.createExchangeRate(
        exchangeRateData
      )
    } catch (error) {
      console.log('error', error)
      return false
    } finally {
      loading.value = { ...loading.peek(), create: false }
    }
  }

  const handleUpdateExchangeRate = async (exchangeRateData: {
    uid: string
    purchasePrice?: string | number
    salePrice?: string | number
    trm?: string | number
    date?: string
  }): Promise<boolean> => {
    loading.value = { ...loading.peek(), update: true }
    try {
      return await exchangeRatesStateActions.updateExchangeRate(
        exchangeRateData
      )
    } finally {
      loading.value = { ...loading.peek(), update: false }
    }
  }

  const handleDeleteExchangeRate = async (uid: string): Promise<boolean> => {
    loading.value = { ...loading.peek(), delete: true }
    try {
      return await exchangeRatesStateActions.deleteExchangeRate(uid)
    } finally {
      loading.value = { ...loading.peek(), delete: false }
    }
  }

  const handleEditExchangeRate = (exchangeRate: IExchangeRate) => {
    exchangeRatesStateActions.editExchangeRate(exchangeRate)
  }

  const handleAddExchangeRate = () => {
    exchangeRatesStateActions.addExchangeRate()
  }

  const handleCloseDrawer = () => {
    exchangeRatesStateActions.closeDrawer()
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    exchangeRatesStateActions.changePagination(page, pageSize)
  }

  const handleApplyFilters = (filters: IExchangeRateFilters) => {
    exchangeRatesStateActions.applyFilters(filters)
  }

  const handleRefresh = async () => {
    await loadExchangeRates()
  }

  return {
    // State
    exchangeRates: ExchangeRatesState.exchangeRates,
    paginatedExchangeRates: ExchangeRatesState.paginatedExchangeRates,
    currentExchangeRate: ExchangeRatesState.currentExchangeRate,
    openDrawer: ExchangeRatesState.openDrawer,
    editMode: ExchangeRatesState.editMode,
    loading,

    // Pagination
    currentPage: ExchangeRatesState.currentPage,
    pageSize: ExchangeRatesState.pageSize,
    total: ExchangeRatesState.total,
    totalPages: ExchangeRatesState.totalPages,

    // Filters
    filters: ExchangeRatesState.filters,

    // Selectors
    activeExchangeRates: exchangeRatesSelectors.activeExchangeRates,
    exchangeRatesByCurrency: exchangeRatesSelectors.exchangeRatesByCurrency,
    exchangeRatesByPaymentMethod:
      exchangeRatesSelectors.exchangeRatesByPaymentMethod,
    hasFilters: exchangeRatesSelectors.hasFilters,
    getExchangeRate: exchangeRatesSelectors.getExchangeRate,

    // Actions
    handleCreateExchangeRate,
    handleUpdateExchangeRate,
    handleDeleteExchangeRate,
    handleEditExchangeRate,
    handleAddExchangeRate,
    handleCloseDrawer,
    handlePaginationChange,
    handleApplyFilters,
    handleRefresh,
    loadExchangeRates,
  }
}
