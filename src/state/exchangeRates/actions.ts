import { batch } from '@preact/signals-react'
import { message } from 'antd'

import {
  type IExchangeRate,
  type IExchangeRatePaginationOptions,
} from '@/interfaces'
import { ExchangeRatesState } from './index'

import appRequests from '../requests'

export const exchangeRatesStateActions = {
  addExchangeRate: () => {
    batch(() => {
      ExchangeRatesState.currentExchangeRate.value = {
        uid: '',
        officeUId: '',
        currencyUId: '',
        paymentMethodUId: '',
        purchasePrice: '0',
        salePrice: '0',
        trm: '0',
        date: new Date().toISOString().split('T')[0], // Today's date
        createdAt: '',
        updatedAt: '',
        office: {
          uid: '',
          name: '',
        },
        currency: {
          uid: '',
          name: '',
          code: '',
          symbol: '',
        },
        paymentMethod: {
          uid: '',
          name: '',
          description: '',
        },
      }
      ExchangeRatesState.openDrawer.value = true
      ExchangeRatesState.editMode.value = false
    })
  },

  editExchangeRate: (exchangeRate: IExchangeRate) => {
    batch(() => {
      ExchangeRatesState.currentExchangeRate.value = { ...exchangeRate }
      ExchangeRatesState.openDrawer.value = true
      ExchangeRatesState.editMode.value = true
    })
  },

  closeDrawer: () => {
    batch(() => {
      ExchangeRatesState.openDrawer.value = false
      ExchangeRatesState.currentExchangeRate.value = {
        uid: '',
        officeUId: '',
        currencyUId: '',
        paymentMethodUId: '',
        purchasePrice: '0',
        salePrice: '0',
        trm: '0',
        date: '',
        createdAt: '',
        updatedAt: '',
        office: {
          uid: '',
          name: '',
        },
        currency: {
          uid: '',
          name: '',
          code: '',
          symbol: '',
        },
        paymentMethod: {
          uid: '',
          name: '',
          description: '',
        },
      }
    })
  },

  createExchangeRate: async (exchangeRateData: {
    officeUId: string
    currencyUId: string
    paymentMethodUId: string
    purchasePrice: string | number
    salePrice: string | number
    trm: string | number
    date: string
  }): Promise<boolean> => {
    try {
      const { data } = await appRequests.ExchangeRates.create(exchangeRateData)
      ExchangeRatesState.exchangeRates.value = [
        ...ExchangeRatesState.exchangeRates.peek(),
        data,
      ]

      ExchangeRatesState.openDrawer.value = false
      message.success('Tasa de cambio creada exitosamente')

      // Update current exchange rate
      ExchangeRatesState.currentExchangeRate.value = data

      return true
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Error al crear la tasa de cambio'
      message.error(errorMessage)
      return false
    }
  },

  updateExchangeRate: async (exchangeRateData: {
    uid: string
    purchasePrice?: string | number
    salePrice?: string | number
    trm?: string | number
    date?: string
  }): Promise<boolean> => {
    try {
      const { data } = await appRequests.ExchangeRates.update(exchangeRateData)

      ExchangeRatesState.exchangeRates.value = ExchangeRatesState.exchangeRates
        .peek()
        .map((exchangeRate) =>
          exchangeRate.uid === data.uid
            ? { ...exchangeRate, ...data }
            : exchangeRate
        )

      ExchangeRatesState.paginatedExchangeRates.value =
        ExchangeRatesState.paginatedExchangeRates
          .peek()
          .map((exchangeRate) =>
            exchangeRate.uid === data.uid
              ? { ...exchangeRate, ...data }
              : exchangeRate
          )

      ExchangeRatesState.openDrawer.value = false
      message.success('Tasa de cambio actualizada exitosamente')

      ExchangeRatesState.currentExchangeRate.value = data

      return true
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        'Error al actualizar la tasa de cambio'
      message.error(errorMessage)
      return false
    }
  },

  deleteExchangeRate: async (uid: string): Promise<boolean> => {
    try {
      await appRequests.ExchangeRates.delete({ uid })

      const currentPaginatedExchangeRates =
        ExchangeRatesState.paginatedExchangeRates.peek()
      const filteredPaginatedExchangeRates =
        currentPaginatedExchangeRates.filter(
          (exchangeRate: IExchangeRate) => exchangeRate.uid !== uid
        )

      ExchangeRatesState.paginatedExchangeRates.value =
        filteredPaginatedExchangeRates

      ExchangeRatesState.total.value = ExchangeRatesState.total.peek() - 1

      message.success('Tasa de cambio eliminada exitosamente')

      return true
    } catch (error: any) {
      console.error('Error deleting exchange rate:', error)
      message.error(
        error?.response?.data?.message || 'Error al eliminar la tasa de cambio'
      )
      return false
    }
  },

  getAllExchangeRates: async (filters: {
    date: string
    officeUId?: string
    currencyUId?: string
    paymentMethodUId?: string
  }) => {
    try {
      const response = await appRequests.ExchangeRates.getAll(filters)
      ExchangeRatesState.exchangeRates.value = response.data.data
    } catch (error: any) {
      console.error('Error loading all exchange rates:', error)
      message.error('Error al cargar las tasas de cambio')
    }
  },

  getExchangeRatesPaginated: async (
    options?: IExchangeRatePaginationOptions
  ) => {
    try {
      const currentFilters = ExchangeRatesState.filters.value
      const paginationOptions: IExchangeRatePaginationOptions = {
        date: options?.date || currentFilters.date,
        officeUId: options?.officeUId || currentFilters.officeUId,
        currencyUId: options?.currencyUId || currentFilters.currencyUId,
        paymentMethodUId:
          options?.paymentMethodUId || currentFilters.paymentMethodUId,
        page: options?.page || ExchangeRatesState.currentPage.peek(),
        limit: options?.limit || ExchangeRatesState.pageSize.peek(),
      }

      const response =
        await appRequests.ExchangeRates.getPaginated(paginationOptions)

      batch(() => {
        ExchangeRatesState.paginatedExchangeRates.value =
          response.data.exchangeRates
        ExchangeRatesState.total.value = response.data.total
        ExchangeRatesState.currentPage.value = response.data.page
        ExchangeRatesState.pageSize.value = response.data.limit
        ExchangeRatesState.totalPages.value = Math.ceil(
          response.data.total / response.data.limit
        )
      })
    } catch (error: any) {
      console.error('Error loading paginated exchange rates:', error)
      message.error('Error al cargar las tasas de cambio')
    }
  },

  changePagination: (page: number, pageSize: number) => {
    batch(() => {
      ExchangeRatesState.currentPage.value = page
      ExchangeRatesState.pageSize.value = pageSize
    })
  },

  applyFilters: (filters: {
    date: string
    officeUId: string
    currencyUId?: string
    paymentMethodUId?: string
  }) => {
    ExchangeRatesState.filters.value = filters
  },

  bulkUploadExchangeRates: async (data: {
    date: string
    officeUId: string
    file: File
  }): Promise<{
    success: boolean
    data?: any
    message?: string
  }> => {
    try {
      const response = await appRequests.ExchangeRates.bulkUpload(data)
      const { success: successCount, failed: failedCount } = response.data

      if (successCount > 0 && failedCount === 0) {
        message.success(`Carga exitosa: ${successCount} registros procesados`)
      } else if (successCount > 0 && failedCount > 0) {
        message.warning(
          `Carga parcial: ${successCount} exitosos, ${failedCount} fallidos`
        )
      } else if (failedCount > 0) {
        message.error(`Error: ${failedCount} registros fallaron`)
      } else {
        message.error('No se procesaron registros')
      }

      return {
        success: successCount > 0,
        data: response.data,
        message: `Procesados: ${successCount} exitosos, ${failedCount} fallidos`,
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error en la carga masiva'
      message.error(errorMessage)

      return {
        success: false,
        data: error.response?.data,
        message: errorMessage,
      }
    }
  },
}
