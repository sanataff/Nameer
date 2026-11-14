import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),

  route('business', './routes/business/cart-layout.tsx', [
    index('./routes/business/index.tsx', {
      id: 'business-index',
    }),
    route('cart', './routes/business/cart.tsx'),
    route('checkout', './routes/business/checkout.tsx'),
    route('chat', './routes/business/chat.tsx'),
    route('order-confirmation', './routes/business/order-confirmation.tsx'),
    route('orders', './routes/business/orders.tsx'),
    route('account-settings', './routes/business/account-settings.tsx'),
    route('browse-products', './routes/business/browse-products.tsx', {
      id: 'business-browse-products',
    }),
    route('home-page-cafes', './routes/business/home-page-cafes.tsx', {
      id: 'business-home-page-cafes',
    }),
    route('cafes', './routes/business/home-page-cafes.tsx', {
      id: 'legacy-business-cafes',
    }),
    route('propose-to-local-provider', './routes/business/propose-to-local-provider.tsx'),
    route('propose-to-local-provider/success', './routes/business/propose-to-local-provider-success.tsx'),
  ]),
  route('bussiness', './routes/business/cart-layout.tsx', {
    id: 'legacy-bussiness-layout',
  }, [
    index('./routes/business/index.tsx', {
      id: 'legacy-bussiness-index',
    }),
    route('home-page-cafes', './routes/business/home-page-cafes.tsx', {
      id: 'legacy-bussiness-home-page-cafes',
    }),
    route('account-settings', './routes/business/account-settings.tsx', {
      id: 'legacy-bussiness-account-settings',
    }),
    route('browse-products', './routes/business/browse-products.tsx', {
      id: 'legacy-bussiness-browse-products',
    }),
    route('accountSettings', './routes/business/account-settings.tsx', {
      id: 'legacy-bussiness-account-settings-alt',
    }),
    route('HomePageCafes', './routes/business/home-page-cafes.tsx', {
      id: 'legacy-bussiness-home-page-cafes-alt',
    }),
    route('Browse products', './routes/business/browse-products.tsx', {
      id: 'legacy-bussiness-browse-products-alt',
    }),
  ]),
  route('login', './routes/auth/login.tsx'),
  route('admin/login', './routes/admin/login.tsx'),
  route('business/cafes', './routes/business/home-page-cafes.tsx'),
  route('business/account-settings', './routes/business/account-settings.tsx'),
  route('business/browse-products', './routes/business/browse-products.tsx'),
  route('business/propose-to-local-provider', './routes/business/propose-to-local-provider.tsx'),
  route('business/propose-to-local-provider/success', './routes/business/propose-to-local-provider-success.tsx'),
  route('admin', './routes/admin/layout.tsx', [
    index('./routes/admin/dashboard.tsx'),
    route('users', './routes/admin/users.tsx'),
    route('chat', './routes/admin/chat.tsx'),
    route('store-verification', './routes/admin/store-verification.tsx'),
    route('customer-service', './routes/admin/customer-service.tsx'),
    route('customer-service/:requestId', './routes/admin/customer-service-request.tsx'),
  ]),
  route('register/supplier', './routes/auth/register-supplier.tsx'),
  route('register/cafe', './routes/auth/register-cafe.tsx'),
  route('supplier/dashboard', './routes/supplier/dashboard.tsx'),
  route('supplier/products', './routes/supplier/products.tsx'),
  route('supplier/orders', './routes/supplier/orders.tsx'),
  route('supplier/notifications', './routes/supplier/notifications.tsx'),
  route('supplier/chat', './routes/supplier/chat.tsx'),
] satisfies RouteConfig
