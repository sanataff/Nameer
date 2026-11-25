import bakery from '../../bussiness/image/bakery.jpeg'
import brownies from '../../bussiness/image/brownies.jpeg'
import cake from '../../bussiness/image/cake.jpeg'
import cheesecake from '../../bussiness/image/cheesecake.jpeg'
import cookies from '../../bussiness/image/cookies.jpeg'
import cupcake from '../../bussiness/image/cupcake.jpeg'
import eidSweets from '../../bussiness/image/eid-sweets.jpeg'
import miniCheesecake from '../../bussiness/image/minicheesecake.jpeg'
import pistachioCake from '../../bussiness/image/pistachio-cake.jpeg'
import sweet from '../../bussiness/image/sweet.jpeg'
import sweets from '../../bussiness/image/sweets.jpeg'
import tiramisu from '../../bussiness/image/tiramisu.jpeg'
import type { Product, ProductCategory } from '@/api/products'

export const supplierProductImages = {
  bakery,
  brownies,
  cake,
  cheesecake,
  cookies,
  cupcake,
  dateBites: sweet,
  eidSweets,
  miniCheesecake,
  pistachioCake,
  sweets,
  tiramisu,
}

const seededProductImages: Record<string, string> = {
  'p-1001': supplierProductImages.cookies,
  'p-1002': supplierProductImages.bakery,
  'p-1003': supplierProductImages.dateBites,
  'p-1004': supplierProductImages.bakery,
  'p-1005': supplierProductImages.pistachioCake,
  'p-1006': supplierProductImages.tiramisu,
  'p-1007': supplierProductImages.cheesecake,
  'p-1008': supplierProductImages.cupcake,
}

const categoryImages: Record<ProductCategory, string> = {
  sweets: supplierProductImages.sweets,
  bakery: supplierProductImages.bakery,
  savory: supplierProductImages.eidSweets,
  beverages: supplierProductImages.tiramisu,
}

export function getSupplierProductImage(
  product: Pick<Product, 'id' | 'category'>,
) {
  return seededProductImages[product.id] ?? categoryImages[product.category]
}
