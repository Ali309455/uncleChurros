'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { mockOrders } from '@/data/orders'
import { products as initialProducts } from '@/data/products'
import { cartSubtotal, cartQuantity } from '@/utils/cart'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([])
  const [lastOrderId, setLastOrderId] = useState('')
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState(mockOrders)
  const [products, setProducts] = useState(initialProducts)

  const addToCart = useCallback((product, qty) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { ...product, quantity: qty }]
    })
  }, [])

  const updateQty = useCallback((id, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((i) => i.id !== id)
      return prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    })
  }, [])

  const placeOrder = useCallback(
    (formData) => {
      const subtotal = cartSubtotal(cart)
      const totalQty = cartQuantity(cart)
      const discount = totalQty >= 6 ? subtotal * 0.1 : 0
      const id = `UW-${Date.now().toString().slice(-6)}`
      const newOrder = {
        id,
        date: new Date().toISOString().split('T')[0],
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '—',
        },
        address: `${formData.address}, ${formData.city}, ${formData.zip}`,
        payment: formData.payment,
        items: cart.map((i) => ({
          name: i.name,
          qty: i.quantity,
          price: i.price,
          image: i.image,
        })),
        subtotal,
        discount,
        total: subtotal - discount,
        status: 'Placed',
      }
      setOrders((prev) => [newOrder, ...prev])
      setLastOrderId(id)
      setCart([])
    },
    [cart]
  )

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }, [])

  const updateOrderShipping = useCallback((orderId, tracking, carrier, shipstationOrderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, trackingNumber: tracking, carrier, shipstationOrderId, status: 'Dispatched' }
          : o
      )
    )
  }, [])

  const addProduct = useCallback((p) => {
    setProducts((prev) => [...prev, p])
  }, [])

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const toggleFeatured = useCallback((id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    )
  }, [])

  const login = useCallback((u) => {
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      cart,
      cartCount: cartQuantity(cart),
      lastOrderId,
      user,
      orders,
      products,
      addToCart,
      updateQty,
      placeOrder,
      updateOrderStatus,
      updateOrderShipping,
      addProduct,
      deleteProduct,
      toggleFeatured,
      login,
      logout,
    }),
    [
      cart,
      lastOrderId,
      user,
      orders,
      products,
      addToCart,
      updateQty,
      placeOrder,
      updateOrderStatus,
      updateOrderShipping,
      addProduct,
      deleteProduct,
      toggleFeatured,
      login,
      logout,
    ]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
