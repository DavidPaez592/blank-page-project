import { lazy } from 'react'

import { PRIVATE_ROUTE, PUBLIC_ROUTE } from '@/constants'

const ActivateAccountPage = lazy(
  () => import('@/containers/pages/activateAccount')
)
const SignInPage = lazy(() => import('@/containers/pages/signIn'))
const SignUpPage = lazy(() => import('@/containers/pages/signup'))
const ForgotPasswordPage = lazy(
  () => import('@/containers/pages/forgotPassword')
)
const ResetPasswordPage = lazy(() => import('@/containers/pages/resetPassword'))

const HomePage = lazy(() => import('@/containers/pages/home'))
const DevelopmentPage = lazy(() => import('@/containers/pages/development'))
const ProfilePage = lazy(() => import('@/containers/pages/profile'))
const RolesPage = lazy(() => import('@/containers/pages/roles'))
const UsersPage = lazy(() => import('@/containers/pages/users'))
const PermissionsPage = lazy(() => import('@/containers/pages/permissions'))
const RoutesPage = lazy(() => import('@/containers/pages/routes'))
const MenuItemsPage = lazy(() => import('@/containers/pages/menuItems'))
const CurrenciesPage = lazy(() => import('@/containers/pages/currencies'))
const ExchangeRatesPage = lazy(() => import('@/containers/pages/exchangeRates'))
const LocationsPage = lazy(() => import('@/containers/pages/locations'))
const PaymentMethodsPage = lazy(
  () => import('@/containers/pages/paymentMethods')
)
const TenantSelectorPage = lazy(
  () => import('@/containers/pages/tenantSelector')
)
const TenantsPage = lazy(() => import('@/containers/pages/tenants'))
const TenantDetailPage = lazy(() => import('@/containers/pages/tenants/detail'))
const OfficesPage = lazy(() => import('@/containers/pages/offices'))
const ClientsPage = lazy(() => import('@/containers/pages/clients'))
const CompraVentaPage = lazy(() => import('@/containers/pages/compraventa'))
const CashBoxesPage = lazy(() => import('@/containers/pages/cashboxes'))
const CashBoxesTypePage = lazy(() => import('@/containers/pages/cashboxestype'))
const ProvisionsAndTransfersPage = lazy(
  () => import('@/containers/pages/transfers&Provisions')
)

/**
 * Public routes array
 */
export const publicRoutes: { component: React.FC; path: string }[] = [
  {
    component: ActivateAccountPage,
    path: PUBLIC_ROUTE.ACTIVATE_ACCOUNT,
  },
  {
    component: SignInPage,
    path: PUBLIC_ROUTE.SIGN_IN,
  },
  {
    component: SignUpPage,
    path: PUBLIC_ROUTE.SIGN_UP,
  },
  {
    component: ForgotPasswordPage,
    path: PUBLIC_ROUTE.FORGOT_PASSWORD,
  },
  {
    component: ResetPasswordPage,
    path: PUBLIC_ROUTE.RESET_PASSWORD,
  },
]

/**
 * Private routes array
 */
export const privateRoutes: { component: React.FC; path: string }[] = [
  {
    component: TenantSelectorPage,
    path: '/select-tenant',
  },
  {
    component: HomePage,
    path: PRIVATE_ROUTE.HOME,
  },
  {
    component: DevelopmentPage,
    path: PRIVATE_ROUTE.DEVELOPMENT,
  },
  {
    component: ProfilePage,
    path: PRIVATE_ROUTE.PROFILE,
  },
  {
    component: RolesPage,
    path: PRIVATE_ROUTE.ROLES,
  },
  {
    component: UsersPage,
    path: PRIVATE_ROUTE.USERS,
  },
  {
    component: PermissionsPage,
    path: PRIVATE_ROUTE.PERMISSIONS,
  },
  {
    component: RoutesPage,
    path: PRIVATE_ROUTE.ROUTES,
  },
  {
    component: MenuItemsPage,
    path: PRIVATE_ROUTE.MENU_ITEMS,
  },
  {
    component: CurrenciesPage,
    path: PRIVATE_ROUTE.CURRENCIES,
  },
  {
    component: ExchangeRatesPage,
    path: PRIVATE_ROUTE.EXCHANGE_RATES,
  },
  {
    component: LocationsPage,
    path: PRIVATE_ROUTE.LOCATIONS,
  },
  {
    component: PaymentMethodsPage,
    path: PRIVATE_ROUTE.PAYMENT_METHODS,
  },
  {
    component: OfficesPage,
    path: PRIVATE_ROUTE.OFFICES,
  },
  {
    component: ClientsPage,
    path: PRIVATE_ROUTE.CLIENTS,
  },
  {
    component: CompraVentaPage,
    path: PRIVATE_ROUTE.COMPRAVENTA,
  },
  {
    component: CashBoxesPage,
    path: PRIVATE_ROUTE.CASHBOXES,
  },
  {
    component: CashBoxesTypePage,
    path: PRIVATE_ROUTE.CASHBOXESTYPE,
  },
  {
    component: TenantsPage,
    path: PRIVATE_ROUTE.TENANTS,
  },
  {
    component: TenantDetailPage,
    path: PRIVATE_ROUTE.TENANT_DETAIL,
  },
  {
    component: CashBoxesTypePage,
    path: PRIVATE_ROUTE.CASHBOXESTYPE,
  },
  {
    component: ProvisionsAndTransfersPage,
    path: PRIVATE_ROUTE.PROVISIONS_TRANSFERS,
  },
]
