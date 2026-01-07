import authRequests from './auth/requests'
import currenciesRequests from './currencies/requests'
import exchangeRatesRequests from './exchangeRates/requests'
import locationsRequests from './locations/requests'
import menuItemsRequest from './menu-items/requests'
import paramsRequests from './params/requests'
import paymentMethodsRequests from './paymentMethods/requests'
import permissionsRequests from './permissions/requests'
import rolesRequests from './roles/requests'
import routesRequests from './routes/requests'
import tenantsRequests from './tenants/requests'
import usersRequests from './users/requests'

const appRequests = {
  Auth: authRequests,
  Currencies: currenciesRequests,
  ExchangeRates: exchangeRatesRequests,
  Locations: locationsRequests,
  MenuItems: menuItemsRequest,
  Params: paramsRequests,
  PaymentMethods: paymentMethodsRequests,
  Permissions: permissionsRequests,
  Roles: rolesRequests,
  Routes: routesRequests,
  Tenants: tenantsRequests,
  Users: usersRequests,
}

export default appRequests
