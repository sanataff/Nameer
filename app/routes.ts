import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),

  route('business', './routes/business/cart-layout.tsx', [
    route('cart', './routes/business/cart.tsx'),
    route('checkout', './routes/business/checkout.tsx'),
    route('chat', './routes/business/chat.tsx'),
    route('order-confirmation', './routes/business/order-confirmation.tsx'),
  ]),
  route('business/orders', './routes/business/orders.tsx'),
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
