// ProductService — all product reads/writes go through this class.
// Components must never call Firestore collection functions directly.

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase/config'

const PRODUCTS = 'products'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']

/** Strip Firestore document id/timestamps into the plain product shape. */
function mapProduct(snapshot) {
  const data = snapshot.data()
  return { ...data, id: snapshot.id }
}

const IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1767489386700-cb3dbcbab13d?w=480&h=600&fit=crop&auto=format'

export const productImageFallback = IMAGE_FALLBACK

export class ProductService {
  /** All products, newest first. */
  async getProducts() {
    const snap = await getDocs(query(collection(db, PRODUCTS), orderBy('createdAt', 'desc')))
    return snap.docs.map(mapProduct)
  }

  /** A single product by document id. Throws 'Product not found'. */
  async getProductById(productId) {
    const snap = await getDoc(doc(db, PRODUCTS, productId))
    if (!snap.exists()) throw new Error('Product not found')
    return mapProduct(snap)
  }

  /** Products in a category ('churros' | 'beignets' | 'chimichangas'). */
  async getProductsByCategory(category) {
    const snap = await getDocs(
      query(collection(db, PRODUCTS), where('category', '==', category))
    )
    return snap.docs.map(mapProduct)
  }

  /** Case-insensitive substring search over name/description/category. */
  async searchProducts(searchTerm) {
    const term = String(searchTerm || '').trim().toLowerCase()
    if (!term) return this.getProducts()
    const products = await this.getProducts()
    return products.filter((p) =>
      [p.name, p.description, p.category].some((field) =>
        String(field || '').toLowerCase().includes(term)
      )
    )
  }

  /**
   * Upload a product image to Firebase Storage.
   * Only image files are accepted — anything else throws.
   * Returns the public download URL.
   */
  async uploadImage(file) {
    if (!file) throw new Error('No file selected')
    if (!IMAGE_TYPES.includes(file.type)) {
      throw new Error('Only image files are allowed (JPG, PNG, WEBP, GIF, AVIF, SVG)')
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be 5 MB or smaller')
    }
    const extension = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`
    const snapshot = await uploadBytes(ref(storage, path), file)
    return getDownloadURL(snapshot.ref)
  }

  /**
   * Create a product. `stock` is optional; omit/null = stock not tracked.
   * Accepts the admin form shape (price, price6plus, parkPrice, ...).
   */
  async addProduct(productData) {
    if (!productData?.name) throw new Error('Product name is required')
    if (productData.price != null && Number.isNaN(Number(productData.price))) {
      throw new Error('Invalid product price')
    }
    const now = serverTimestamp()
    const docRef = await addDoc(collection(db, PRODUCTS), {
      ...productData,
      createdAt: now,
      updatedAt: now,
    })
    return this.getProductById(docRef.id)
  }

  /** Merge updates into an existing product. Throws 'Product not found'. */
  async updateProduct(productId, productData) {
    await this.getProductById(productId)
    await updateDoc(doc(db, PRODUCTS, productId), {
      ...productData,
      updatedAt: serverTimestamp(),
    })
    return this.getProductById(productId)
  }

  /** Delete a product by document id. */
  async deleteProduct(productId) {
    await deleteDoc(doc(db, PRODUCTS, productId))
  }
}

/** Singleton — import this everywhere. */
export const productService = new ProductService()
