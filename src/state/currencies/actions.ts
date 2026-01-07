import { batch } from '@preact/signals-react'
import { message } from 'antd'

import { type ICurrency } from '@/interfaces'
import { CurrenciesState } from '@/state'

import appRequests from '../requests'

export const currenciesStateActions = {
  // Add new currency
  addCurrency: async () => {
    batch(() => {
      CurrenciesState.currentCurrency.value = {
        uid: '',
        name: '',
        code: '',
        symbol: '',
        createdAt: '',
        updatedAt: '',
      }
      CurrenciesState.openDrawer.value = true
      CurrenciesState.editMode.value = false
    })
  },

  // Edit existing currency
  editCurrency: (currency: ICurrency) => {
    batch(() => {
      CurrenciesState.currentCurrency.value = { ...currency }
      CurrenciesState.openDrawer.value = true
      CurrenciesState.editMode.value = true
    })
  },

  // Close drawer
  closeDrawer: () => {
    batch(() => {
      CurrenciesState.openDrawer.value = false
      CurrenciesState.currentCurrency.value = {
        uid: '',
        name: '',
        code: '',
        symbol: '',
        createdAt: '',
        updatedAt: '',
      }
      CurrenciesState.editMode.value = false
    })
  },

  // Create currency
  createCurrency: async (currencyData: {
    name: string
    code: string
    symbol: string
  }) => {
    try {
      CurrenciesState.loading.value = true

      const { data } = await appRequests.Currencies.create(currencyData)
      console.log('data', data)
      // Add to the currencies list
      CurrenciesState.paginatedCurrencies.value = [
        ...CurrenciesState.paginatedCurrencies.peek(),
        data,
      ]

      // Close drawer and show success message
      currenciesStateActions.closeDrawer()
      message.success('Moneda creada exitosamente')

      // Refresh paginated data
      await currenciesStateActions.getCurrenciesPaginated()

      return true
    } catch (error: any) {
      console.error('Error creating currency:', error)
      message.error(
        error?.response?.data?.message || 'Error al crear la moneda'
      )
      return false
    } finally {
      CurrenciesState.loading.value = false
    }
  },

  // Update currency
  updateCurrency: async (currencyData: {
    uid: string
    name?: string
    code?: string
    symbol?: string
  }) => {
    try {
      CurrenciesState.loading.value = true

      const { data } = await appRequests.Currencies.update(currencyData)

      // Update in paginated data
      const currentPaginatedCurrencies =
        CurrenciesState.paginatedCurrencies.peek()
      const updatedPaginatedCurrencies = currentPaginatedCurrencies.map(
        (currency: ICurrency) =>
          currency.uid === currencyData.uid
            ? {
                ...currency,
                ...data,
              }
            : currency
      )
      CurrenciesState.paginatedCurrencies.value = updatedPaginatedCurrencies

      // Close drawer and show success message
      currenciesStateActions.closeDrawer()
      message.success('Moneda actualizada exitosamente')

      return true
    } catch (error: any) {
      console.error('Error updating currency:', error)
      message.error(
        error?.response?.data?.message || 'Error al actualizar la moneda'
      )
      return false
    } finally {
      CurrenciesState.loading.value = false
    }
  },

  // Delete currency
  deleteCurrency: async (uid: string) => {
    try {
      CurrenciesState.loading.value = true

      await appRequests.Currencies.delete({ uid })

      // Remove from paginated data
      const currentPaginatedCurrencies =
        CurrenciesState.paginatedCurrencies.peek()
      const filteredPaginatedCurrencies = currentPaginatedCurrencies.filter(
        (currency: ICurrency) => currency.uid !== uid
      )
      CurrenciesState.paginatedCurrencies.value = filteredPaginatedCurrencies

      // Update total count
      CurrenciesState.total.value = Math.max(
        0,
        CurrenciesState.total.peek() - 1
      )

      message.success('Moneda eliminada exitosamente')

      // Refresh paginated data to maintain pagination
      await currenciesStateActions.getCurrenciesPaginated()

      return true
    } catch (error: any) {
      console.error('Error deleting currency:', error)
      message.error(
        error?.response?.data?.message || 'Error al eliminar la moneda'
      )
      return false
    } finally {
      CurrenciesState.loading.value = false
    }
  },

  // Get all currencies
  getAllCurrencies: async () => {
    try {
      CurrenciesState.loading.value = true

      const { data } = await appRequests.Currencies.getAll()
      CurrenciesState.currencies.value = data

      return data
    } catch (error: any) {
      console.error('Error fetching currencies:', error)
      message.error(
        error?.response?.data?.message || 'Error al cargar las monedas'
      )
      return []
    } finally {
      CurrenciesState.loading.value = false
    }
  },

  // Get paginated currencies
  getCurrenciesPaginated: async (options?: {
    page?: number
    limit?: number
    filters?: {
      name?: string
      code?: string
      isActive?: boolean
      search?: string
    }
  }) => {
    try {
      CurrenciesState.loading.value = true

      const paginationOptions = {
        page: options?.page || CurrenciesState.currentPage.peek(),
        limit: options?.limit || CurrenciesState.pageSize.peek(),
        filters: options?.filters || CurrenciesState.filters.peek(),
      }

      const { data } =
        await appRequests.Currencies.getPaginated(paginationOptions)

      batch(() => {
        CurrenciesState.paginatedCurrencies.value = data.currencies
        CurrenciesState.total.value = data.total
        CurrenciesState.currentPage.value = data.page
        CurrenciesState.pageSize.value = data.limit
        CurrenciesState.totalPages.value = data.totalPages
      })

      return data.currencies
    } catch (error: any) {
      console.error('Error fetching paginated currencies:', error)
      message.error(
        error?.response?.data?.message || 'Error al cargar las monedas'
      )
      return []
    } finally {
      CurrenciesState.loading.value = false
    }
  },

  // Change pagination
  changePagination: (page: number, pageSize: number) => {
    batch(() => {
      CurrenciesState.currentPage.value = page
      CurrenciesState.pageSize.value = pageSize
    })

    currenciesStateActions.getCurrenciesPaginated({ page, limit: pageSize })
  },

  // Apply filters
  applyFilters: (filters: {
    name?: string
    code?: string
    isActive?: boolean
    search?: string
  }) => {
    batch(() => {
      CurrenciesState.filters.value = filters
      CurrenciesState.currentPage.value = 1 // Reset to first page when filtering
    })

    currenciesStateActions.getCurrenciesPaginated({
      page: 1,
      filters,
    })
  },

  // Clear filters
  clearFilters: () => {
    batch(() => {
      CurrenciesState.filters.value = {}
      CurrenciesState.currentPage.value = 1
    })

    currenciesStateActions.getCurrenciesPaginated({
      page: 1,
      filters: {},
    })
  },
}
