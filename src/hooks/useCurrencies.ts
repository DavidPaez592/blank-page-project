import { useSignal } from '@preact/signals-react'
import { useEffect } from 'react'
import { message } from 'antd'

import { type ICurrency, type ICurrencyFilters } from '@/interfaces'
import { CurrenciesState, currenciesSelectors } from '@/state'
import { currenciesStateActions } from '@/state/currencies/actions'

export const useCurrencies = () => {
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
    loadCurrencies()
  }, [])

  // Load all currencies
  const loadCurrencies = async () => {
    loading.value = { ...loading.peek(), list: true }
    try {
      await currenciesStateActions.getAllCurrencies()
      await currenciesStateActions.getCurrenciesPaginated()
    } catch (error) {
      console.error('Error loading currencies:', error)
    } finally {
      loading.value = { ...loading.peek(), list: false }
    }
  }

  // Create currency
  const handleCreateCurrency = async (currencyData: {
    name: string
    code: string
    symbol: string
  }): Promise<boolean> => {
    loading.value = { ...loading.peek(), create: true }
    try {
      return await currenciesStateActions.createCurrency(currencyData)
    } catch (error) {
      console.log('error', error)
      return false
    } finally {
      loading.value = { ...loading.peek(), create: false }
    }
  }

  // Update currency
  const handleUpdateCurrency = async (currencyData: {
    uid: string
    name?: string
    code?: string
    symbol?: string
  }): Promise<boolean> => {
    loading.value = { ...loading.peek(), update: true }
    try {
      return await currenciesStateActions.updateCurrency(currencyData)
    } finally {
      loading.value = { ...loading.peek(), update: false }
    }
  }

  // Delete currency
  const handleDeleteCurrency = async (uid: string): Promise<boolean> => {
    loading.value = { ...loading.peek(), delete: true }
    try {
      return await currenciesStateActions.deleteCurrency(uid)
    } finally {
      loading.value = { ...loading.peek(), delete: false }
    }
  }

  // Edit currency (open drawer with currency data)
  const handleEditCurrency = (currency: ICurrency) => {
    currenciesStateActions.editCurrency(currency)
  }

  // Add currency (open empty drawer)
  const handleAddCurrency = () => {
    currenciesStateActions.addCurrency()
  }

  // Close drawer
  const handleCloseDrawer = () => {
    currenciesStateActions.closeDrawer()
  }

  // Change pagination
  const handlePaginationChange = (page: number, pageSize: number) => {
    currenciesStateActions.changePagination(page, pageSize)
  }

  // Apply filters
  const handleApplyFilters = (filters: ICurrencyFilters) => {
    currenciesStateActions.applyFilters(filters)
  }

  // Clear filters
  const handleClearFilters = () => {
    currenciesStateActions.clearFilters()
  }

  // Refresh data
  const handleRefresh = async () => {
    await loadCurrencies()
  }

  return {
    // State
    currencies: CurrenciesState.currencies,
    paginatedCurrencies: CurrenciesState.paginatedCurrencies,
    currentCurrency: CurrenciesState.currentCurrency,
    openDrawer: CurrenciesState.openDrawer,
    editMode: CurrenciesState.editMode,
    loading,

    // Pagination
    currentPage: CurrenciesState.currentPage,
    pageSize: CurrenciesState.pageSize,
    total: CurrenciesState.total,
    totalPages: CurrenciesState.totalPages,

    // Filters
    filters: CurrenciesState.filters,

    // Selectors
    currencyOptions: currenciesSelectors.currencyOptions,
    hasFilters: currenciesSelectors.hasFilters,

    // Actions
    handleCreateCurrency,
    handleUpdateCurrency,
    handleDeleteCurrency,
    handleEditCurrency,
    handleAddCurrency,
    handleCloseDrawer,
    handlePaginationChange,
    handleApplyFilters,
    handleClearFilters,
    handleRefresh,
    loadCurrencies,
  }
}

// Hook específico para obtener todas las monedas (útil para selects y otras partes)
export const useGetAllCurrencies = () => {
  const loading = useSignal(false)

  useEffect(() => {
    const loadAllCurrencies = async () => {
      loading.value = true
      try {
        await currenciesStateActions.getAllCurrencies()
      } catch (error) {
        console.error('Error loading all currencies:', error)
        message.error('Error al cargar las monedas')
      } finally {
        loading.value = false
      }
    }

    loadAllCurrencies()
  }, [])

  return {
    currencies: CurrenciesState.currencies,
    currencyOptions: currenciesSelectors.currencyOptions,
    loading,
  }
}
