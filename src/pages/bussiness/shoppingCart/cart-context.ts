import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { CartProduct } from './cart-data'

export const CartContext = createContext<{ items: CartProduct[]; setItems: Dispatch<SetStateAction<CartProduct[]>> } | null>(null)

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('Cart components must be inside CartLayout')
  return cart
}
