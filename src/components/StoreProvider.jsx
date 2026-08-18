'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { mockOrders } from '@/data/orders'
import { mockReviews } from '@/data/reviews'
import { products as initialProducts } from '@/data/products'
import { createReviewRecord, updateReviewRecord } from '@/lib/reviews'
import { cartSubtotal, cartQuantity } from '@/utils/cart'

// ── Client-side auth (demo store flow) ──────────────────────────────────────
// No backend involved: sessions are plain in-memory user objects. This mirrors
// the old Firebase heuristic (email contains "admin"/"walt" ⇒ admin).

function isAdminEmail(email) {
  const e = String(email || '').toLowerCase()
  return e.includes('admin') || e.includes('walt')
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([])
  const [lastOrderId, setLastOrderId] = useState('')
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState(mockOrders)
  const [products, setProducts] = useState(initialProducts)
  const [reviews, setReviews] = useState(mockReviews)

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
          productId: i.id,
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

  const updateOrderStatus = useCallback(
    (orderId, status) => {
      const prev = orders.find((o) => o.id === orderId)
      if (!prev || prev.status === status) return
      const updated = { ...prev, status }
      setOrders((state) => state.map((o) => (o.id === orderId ? updated : o)))
    },
    [orders]
  )

  const updateOrderShipping = useCallback(
    (orderId, tracking, carrier, shipstationOrderId) => {
      const prev = orders.find((o) => o.id === orderId)
      if (!prev) return
      const updated = {
        ...prev,
        trackingNumber: tracking,
        carrier,
        shipstationOrderId,
        status: 'Dispatched',
      }
      setOrders((state) => state.map((o) => (o.id === orderId ? updated : o)))
    },
    [orders]
  )

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

  const login = useCallback(async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 400))
    const u = {
      uid: `u-${Date.now().toString().slice(-6)}`,
      name: String(email || '').split('@')[0] || 'Guest User',
      email,
      isAdmin: isAdminEmail(email),
    }
    setUser(u)
    return u
  }, [])

  const loginWithGoogle = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 400))
    const u = {
      uid: `g-${Date.now().toString().slice(-6)}`,
      name: 'Google User',
      email: 'google.user@gmail.com',
      isAdmin: false,
    }
    setUser(u)
    return u
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    await new Promise((r) => setTimeout(r, 400))
    const u = {
      uid: `u-${Date.now().toString().slice(-6)}`,
      name: name || String(email || '').split('@')[0],
      email,
      isAdmin: isAdminEmail(email),
    }
    setUser(u)
    return u
  }, [])

  /** Demo-only shortcut — client-side session, no account created. */
  const demoLogin = useCallback((u) => {
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const submitReview = useCallback(
    (productId, input, orderId) => {
      const order = orders.find((o) => o.id === orderId)
      if (!user || !order) return null
      const review = createReviewRecord({ productId, user, order, ...input })
      setReviews((prev) => [review, ...prev])
      return review
    },
    [orders, user]
  )

  const updateReview = useCallback((reviewId, input) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? updateReviewRecord(r, input) : r))
    )
  }, [])

  const value = useMemo(
    () => ({
      cart,
      cartCount: cartQuantity(cart),
      lastOrderId,
      user,
      orders,
      products,
      reviews,
      addToCart,
      updateQty,
      placeOrder,
      updateOrderStatus,
      updateOrderShipping,
      addProduct,
      deleteProduct,
      toggleFeatured,
      submitReview,
      updateReview,
      login,
      loginWithGoogle,
      register,
      demoLogin,
      logout,
    }),
    [
      cart,
      lastOrderId,
      user,
      orders,
      products,
      reviews,
      addToCart,
      updateQty,
      placeOrder,
      updateOrderStatus,
      updateOrderShipping,
      addProduct,
      deleteProduct,
      toggleFeatured,
      submitReview,
      updateReview,
      login,
      loginWithGoogle,
      register,
      demoLogin,
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
