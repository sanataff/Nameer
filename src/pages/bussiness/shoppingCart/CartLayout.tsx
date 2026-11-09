import { useState } from 'react'
import { Outlet } from 'react-router'
import { sampleCart } from './cart-data'
import { CartContext } from './cart-context'

// Shared state survives cart/checkout navigation; refresh restores sample data.
export default function CartLayout() {
  const [items, setItems] = useState(sampleCart)
  return <CartContext.Provider value={{ items, setItems }}><Outlet /></CartContext.Provider>
}
