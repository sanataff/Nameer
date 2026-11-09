import { useState } from 'react'
import { Outlet } from 'react-router'
import { sampleCart } from './cart-data'
import { CartContext, type SubmittedOrder } from './cart-context'

// Shared state survives cart/checkout navigation; refresh restores sample data.
export default function CartLayout() {
  const [items, setItems] = useState(sampleCart)
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null)
  return <CartContext.Provider value={{ items, setItems, submittedOrder, setSubmittedOrder }}><Outlet /></CartContext.Provider>
}
