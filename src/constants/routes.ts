/** The base URL for the router. */
export const ROUTER_BASE = import.meta.env.VITE_ROUTER_BASE

/** The public routes. */
export const PUBLIC_ROUTE = {
  ACTIVATE_ACCOUNT: '/activate-account',
  FORGOT_PASSWORD: '/forgot-pwd',
  RESET_PASSWORD: '/reset-pwd',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
}

/** The private routes. */
export const PRIVATE_ROUTE = {
  CLIENTS: '/clients',
  COMPRAVENTA: '/compraventa',
  CURRENCIES: '/currencies',
  DEVELOPMENT: '/development',
  EXCHANGE_RATES: '/exchange-rates',
  PROVISIONS_TRANSFERS: '/provisiones-y-traslados',
  HOME: '/',
  LOCATIONS: '/locations',
  MENU_ITEMS: '/menu-items',
  PAYMENT_METHODS: '/payment-methods',
  OFFICES: '/offices',
  OFFICES_DETAIL: '/offices/:officeUid',
  PERMISSIONS: '/permissions',
  PROFILE: '/profile',
  ROLES: '/roles',
  ROUTES: '/routes',
  SETTINGS: '/settings',
  TENANTS: '/tenants',
  TENANT_DETAIL: '/tenants/:tenantUid',
  USERS: '/users',
  CASHBOXESTYPE: '/cashboxestype',
  CASHBOXES: '/cashboxes',
}

/** The route methods. */
export const ROUTES_METHODS = [
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
]

/** The route methods options. */
export const ROUTES_METHODS_OPTIONS = ROUTES_METHODS.map((item) => ({
  label: item,
  value: item,
}))
