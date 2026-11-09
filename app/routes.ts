import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
  route('login', './routes/auth/login.tsx'),
  route('admin/login', './routes/admin/login.tsx'),
  route('business/cafes', './routes/business/cafes.tsx'),
  route('business/propose-to-local-provider', './routes/business/propose-to-local-provider.tsx'),
  route('business/propose-to-local-provider/success', '../src/pages/bussiness/proposeToLocalProviderSuccess/index.tsx'),
  route('register/supplier', './routes/auth/register-supplier.tsx'),
  route('register/cafe', './routes/auth/register-cafe.tsx'),
  route('supplier/dashboard', './routes/supplier/dashboard.tsx'),
  route('supplier/products', './routes/supplier/products.tsx'),
  route('supplier/orders', './routes/supplier/orders.tsx'),
  route('supplier/notifications', './routes/supplier/notifications.tsx'),
  route('supplier/chat', './routes/supplier/chat.tsx'),
] satisfies RouteConfig
