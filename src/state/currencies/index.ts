import { signal, computed } from '@preact/signals-react'
import { type ICurrency, type ICurrencyFilters } from '@/interfaces'

// Initial state
const initialCurrency: ICurrency = {
  uid: '',
  name: '',
  code: '',
  symbol: '',
  createdAt: '',
  updatedAt: '',
}

const initialFilters: ICurrencyFilters = {}

// Currency state signals
export const CurrenciesState = {
  // Data
  currencies: signal<ICurrency[]>([]),
  paginatedCurrencies: signal<ICurrency[]>([]),
  currentCurrency: signal<ICurrency>(initialCurrency),

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
  filters: signal<ICurrencyFilters>(initialFilters),
}

export const currenciesSelectors = {
  currencyOptions: computed(() =>
    CurrenciesState.currencies.value?.map((currency) => ({
      label: `${currency.name} (${currency.code})`,
      value: currency.uid,
      code: currency.code,
      symbol: currency.symbol,
    }))
  ),

  hasFilters: computed(() => {
    const filters = CurrenciesState.filters.value
    return !!(filters.name || filters.code || filters.search)
  }),
}
