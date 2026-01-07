import { signal, computed } from '@preact/signals-react'
import { type IExchangeRate, type IExchangeRateFilters } from '@/interfaces'

const initialExchangeRate: IExchangeRate = {
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

const initialFilters: IExchangeRateFilters = {
  date: new Date().toISOString().split('T')[0], // Today's date
  officeUId: '', // Required but initially empty
}

export const ExchangeRatesState = {
  // Data
  exchangeRates: signal<IExchangeRate[]>([]),
  paginatedExchangeRates: signal<IExchangeRate[]>([]),
  currentExchangeRate: signal<IExchangeRate>(initialExchangeRate),

  // UI State
  loading: signal<boolean>(false),
  openDrawer: signal<boolean>(false),
  editMode: signal<boolean>(false),

  // Pagination
  currentPage: signal<number>(1),
  pageSize: signal<number>(10),
  total: signal<number>(0),
  totalPages: signal<number>(0),

  // Filters
  filters: signal<IExchangeRateFilters>(initialFilters),
}

export const exchangeRatesSelectors = {
  activeExchangeRates: computed(() =>
    ExchangeRatesState.exchangeRates.value.filter(
      (rate) =>
        parseFloat(rate.purchasePrice) > 0 && parseFloat(rate.salePrice) > 0
    )
  ),

  exchangeRatesByCurrency: (currencyUId: string) =>
    ExchangeRatesState.exchangeRates.value.filter(
      (rate) => rate.currencyUId === currencyUId
    ),

  exchangeRatesByPaymentMethod: (paymentMethodUId: string) =>
    ExchangeRatesState.exchangeRates.value.filter(
      (rate) => rate.paymentMethodUId === paymentMethodUId
    ),

  hasFilters: computed(() => {
    const filters = ExchangeRatesState.filters.value
    return !!(
      filters.currencyUId ||
      filters.paymentMethodUId ||
      (filters.date &&
        filters.date !== new Date().toISOString().split('T')[0]) ||
      (filters.officeUId && filters.officeUId.trim() !== '')
    )
  }),

  getExchangeRate: (
    currencyUId: string,
    paymentMethodUId: string,
    officeUId: string
  ) =>
    ExchangeRatesState.exchangeRates.value.find(
      (rate) =>
        rate.currencyUId === currencyUId &&
        rate.paymentMethodUId === paymentMethodUId &&
        rate.officeUId === officeUId
    ),
}
