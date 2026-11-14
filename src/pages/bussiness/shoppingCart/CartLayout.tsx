import { useState } from 'react'
import { Outlet } from 'react-router'
import type { CartProduct } from './cart-data'
import { CartContext, type SubmittedOrder } from './cart-context'

// Shared state survives navigation between business pages; a full refresh starts a new demo session.
export default function CartLayout() {
  const [items, setItems] = useState<CartProduct[]>([])
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null)
  return <CartContext.Provider value={{ items, setItems, submittedOrder, setSubmittedOrder }}><Outlet /></CartContext.Provider>
}
