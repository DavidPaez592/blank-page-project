import { signal, computed } from '@preact/signals-react'
import { type IPaymentMethod, type IPaymentMethodFilters } from '@/interfaces'

// Initial values
const initialPaymentMethod: IPaymentMethod = {
  uid: '',
  name: '',
  description: '',
  createdAt: '',
  updatedAt: '',
}

const initialFilters: IPaymentMethodFilters = {}

// Payment method state signals
export const PaymentMethodsState = {
  // Data
  paymentMethods: signal<IPaymentMethod[]>([]),
  paginatedPaymentMethods: signal<IPaymentMethod[]>([]),
  currentPaymentMethod: signal<IPaymentMethod>(initialPaymentMethod),

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
  filters: signal<IPaymentMethodFilters>(initialFilters),
}

// Payment method selectors (computed values)
export const paymentMethodsSelectors = {
  // Get payment methods as options for select components
  paymentMethodOptions: computed(() =>
    PaymentMethodsState.paymentMethods.value?.map((paymentMethod) => ({
      label: paymentMethod.name,
      value: paymentMethod.uid,
      description: paymentMethod.description,
    }))
  ),

  // Check if any filters are applied
  hasFilters: computed(() => {
    const filters = PaymentMethodsState.filters.value
    return !!(filters.name || filters.search)
  }),
}
