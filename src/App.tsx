import { useState } from 'react'
import Nav from './components/Nav'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import { mockOrders } from './data/orders'
import type { Order } from './data/orders'
import { products as initialProducts } from './data/products'
import type { Product } from './data/products'

export type Page =
  | 'home' | 'shop' | 'cart' | 'checkout' | 'confirmation'
  | 'login' | 'signup' | 'admin' | 'contact'

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export type User = {
  name: string
  email: string
  isAdmin: boolean
}

export type CheckoutFormData = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
  payment: 'COD' | 'Stripe'
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [cart, setCart] = useState<CartItem[]>([])
  const [lastOrderId, setLastOrderId] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const addToCart = (product: Omit<CartItem, 'quantity'>, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
      return [...prev, { ...product, quantity: qty }]
    })
  }

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) setCart((prev) => prev.filter((i) => i.id !== id))
    else setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i))
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  const placeOrder = (formData: CheckoutFormData) => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
    const totalQty = cart.reduce((s, i) => s + i.quantity, 0)
    const discount = totalQty >= 6 ? subtotal * 0.1 : 0
    const id = `UW-${Date.now().toString().slice(-6)}`
    const newOrder: Order = {
      id,
      date: new Date().toISOString().split('T')[0],
      customer: { name: formData.name, email: formData.email, phone: formData.phone || '—' },
      address: `${formData.address}, ${formData.city}, ${formData.zip}`,
      payment: formData.payment,
      items: cart.map((i) => ({ name: i.name, qty: i.quantity, price: i.price, image: i.image })),
      subtotal, discount, total: subtotal - discount,
      status: 'Placed',
    }
    setOrders((prev) => [newOrder, ...prev])
    setLastOrderId(id)
    setCart([])
    setPage('confirmation')
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
  }

  const updateOrderShipping = (orderId: string, tracking: string, carrier: string, shipstationOrderId?: string) => {
    setOrders((prev) => prev.map((o) =>
      o.id === orderId ? { ...o, trackingNumber: tracking, carrier, shipstationOrderId, status: 'Dispatched' } : o
    ))
  }

  const addProduct = (p: Product) => setProducts((prev) => [...prev, p])
  const deleteProduct = (id: number) => setProducts((prev) => prev.filter((p) => p.id !== id))
  const toggleFeatured = (id: number) => setProducts((prev) => prev.map((p) => p.id === id ? { ...p, featured: !p.featured } : p))

  const login = (u: User) => {
    setUser(u)
    setPage(u.isAdmin ? 'admin' : 'home')
  }

  const logout = () => {
    setUser(null)
    setPage('home')
  }

  const isAdminPage = page === 'admin'
  const hideNav = isAdminPage || page === 'login' || page === 'signup'

  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-sans)' }}>
      {!hideNav && (
        <Nav page={page} setPage={setPage} cartCount={cartCount} user={user} logout={logout} />
      )}

      {page === 'home' && <Home setPage={setPage} addToCart={addToCart} products={products} />}
      {/* {page === 'shop'         && <Shop setPage={setPage} addToCart={addToCart} products={products} />}
      {page === 'cart'         && <Cart cart={cart} updateQty={updateQty} setPage={setPage} />}
      {page === 'checkout'     && <Checkout cart={cart} setPage={setPage} placeOrder={placeOrder} />}
      {page === 'confirmation' && <OrderConfirmation orderNumber={lastOrderId} setPage={setPage} />}
      {page === 'contact'      && <Contact setPage={setPage} />}
      {page === 'login'        && <Login setPage={setPage} login={login} />}
      {page === 'signup'       && <Signup setPage={setPage} login={login} />} */}

      {/* Admin: show dashboard if authed as admin, otherwise show login gate */}
      {/* {isAdminPage && (
        user?.isAdmin
          ? <Admin
              orders={orders}
              products={products}
              updateOrderStatus={updateOrderStatus}
              updateOrderShipping={updateOrderShipping}
              addProduct={addProduct}
              deleteProduct={deleteProduct}
              toggleFeatured={toggleFeatured}
              logout={logout}
              user={user}
            />
          : <Login setPage={setPage} login={login} intendedAdmin />
      )}
      */}
    </div>
  )
}