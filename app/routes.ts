import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
  route('login', './routes/auth/login.tsx'),
  route('admin/login', './routes/admin/login.tsx'),
  route('admin', './routes/admin/layout.tsx', [
    index('./routes/admin/dashboard.tsx'),
    route('users', './routes/admin/users.tsx'),
    route('chat', './routes/admin/chat.tsx'),
    route('store-verification', './routes/admin/store-verification.tsx'),
    route('store-verification/:userId', './routes/admin/store-verification-detail.tsx'),
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
