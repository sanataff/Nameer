import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { CartProduct } from './cart-data'

export type SubmittedOrder = {
  items: CartProduct[]
  address: string
  payment: 'mada' | 'cash'
}

export const CartContext = createContext<{
  items: CartProduct[]
  setItems: Dispatch<SetStateAction<CartProduct[]>>
  submittedOrder: SubmittedOrder | null
  setSubmittedOrder: Dispatch<SetStateAction<SubmittedOrder | null>>
} | null>(null)

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('Cart components must be inside CartLayout')
  return cart
}
