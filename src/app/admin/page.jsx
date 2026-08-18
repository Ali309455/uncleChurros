'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/components/StoreProvider'
import LoginForm from '@/components/LoginForm'
import { Spinner, OrderRowSkeleton, ProductRowSkeleton, ArrowIcon } from '@/components/ui'
import {
  getShippingRates, createShippingLabel, syncToShippingProvider,
  trackingUrl, carrierLabel,
} from '@/lib/shipping'

const PRODUCT_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1767489386700-cb3cbdbab13d?w=480&h=600&fit=crop&auto=format'

const STATUS_STYLES = {
  Placed:     'bg-blue-500/15 text-blue-300 border border-blue-400/25',
  Dispatched: 'bg-amber-500/15 text-amber-300 border border-amber-400/25',
  Delivered:  'bg-green-500/15 text-green-300 border border-green-400/25',
  Cancelled:  'bg-red-500/15 text-red-400 border border-red-400/25',
}

const STATUSES = ['Placed', 'Dispatched', 'Delivered', 'Cancelled']
const CATEGORIES = ['churros', 'beignets', 'chimichangas']

const CARRIER_COLORS = {
  stamps_com: 'text-blue-300 bg-blue-500/10 border-blue-400/20',
  ups:        'text-amber-300 bg-amber-500/10 border-amber-400/20',
  fedex:      'text-purple-300 bg-purple-500/10 border-purple-400/20',
}

const BULK_SERVICES = [
  { carrier: 'stamps_com', service: 'usps_first_class_mail',      name: 'USPS First Class',      days: 5 },
  { carrier: 'stamps_com', service: 'usps_priority_mail',         name: 'USPS Priority Mail',    days: 3 },
  { carrier: 'stamps_com', service: 'usps_priority_mail_express', name: 'USPS Priority Express', days: 1 },
  { carrier: 'ups',        service: 'ups_ground',                 name: 'UPS Ground',            days: 5 },
  { carrier: 'fedex',      service: 'fedex_ground',               name: 'FedEx Ground',          days: 5 },
]

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}

function Checkbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className="flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
      style={{ borderColor: checked ? '#C9962C' : 'rgba(248,247,242,0.2)', background: checked ? '#C9962C' : 'transparent' }}
    >
      {checked && (
        <svg width="8" height="7" viewBox="0 0 10 8" fill="none" aria-hidden="true">
          <path d="M1 4l3 3 5-6" stroke="#0B1226" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

function ToastNotif({ msg }) {
  return (
    <div
      className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-auto z-[60] flex items-center gap-2 bg-navy-600 border border-gold-500/30 text-star-white text-[13px] font-medium px-4 py-3 rounded-xl shadow-xl"
      style={{ animation: 'hero-copy-up 0.3s ease' }}
    >
      <span className="text-gold-500 flex-shrink-0">✓</span> {msg}
    </div>
  )
}

const DEFAULT_FROM = {
  name: "Uncle Walt's Churros",
  street1: '1313 Disneyland Dr',
  city: 'Anaheim',
  state: 'CA',
  postalCode: '92802',
  phone: '5550001234',
}

// ── Image upload (drag & drop, images only) ─────────────────────────────────

function ImageDropzone({ value, onChange, onError }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (files) => {
    const file = files?.[0]
    if (!file) return
    onError('')
    if (!file.type.startsWith('image/')) {
      onError('Only image files are allowed (JPG, PNG, WEBP, GIF, AVIF, SVG)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      onError('Image must be 5 MB or smaller')
      return
    }
    setUploading(true)
    try {
      const url = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Could not read the image file'))
        reader.readAsDataURL(file)
      })
      onChange(url)
    } catch (err) {
      onError(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-star-white/50">Product image</label>

      {value ? (
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-navy-800 border border-star-white/10">
          <img src={value} alt="Product preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-navy-950/80 backdrop-blur border border-star-white/15 hover:border-gold-500/40 text-star-white/80 hover:text-gold-400 text-[12px] font-medium px-2.5 py-1.5 rounded-lg transition-all">
            Replace
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
          className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center px-4 ${dragging ? 'border-gold-500 bg-gold-500/10' : 'border-star-white/15 bg-navy-800/30 hover:border-gold-500/40 hover:bg-navy-800/60'}`}
        >
          {uploading ? (
            <>
              <Spinner size={20} color="rgba(201,150,44,0.8)" />
              <p className="text-star-white/50 text-[12px]">Uploading…</p>
            </>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-gold-500/70" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-star-white/60 text-[13px] font-medium">Drag &amp; drop an image here</p>
              <p className="text-star-white/30 text-[11px]">or click to browse · JPG, PNG, WEBP, GIF, AVIF, SVG · max 5 MB</p>
            </>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }} />
    </div>
  )
}

function orderWeight(order) {
  return Math.max(0.5, +(order.items.reduce((s, item) => s + item.qty * 0.4, 0)).toFixed(1))
}

// ── Order row ────────────────────────────────────────────────────────────────

function OrderRow({
  order, index, isSelected, isSelectable, isExpanded,
  syncingId, onSelect, onStatusChange, onShip, onExpand, onSync,
}) {
  const itemCount = order.items.reduce((s, i) => s + i.qty, 0)
  const isShipped = !!order.trackingNumber

  const shipIcon = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" /><path d="m16 8 5 0 3 5v3h-8V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )

  const chevron = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      {isExpanded ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
    </svg>
  )

  const rowBg = isSelected
    ? 'bg-gold-500/[0.06]'
    : index % 2 === 0
      ? ''
      : 'bg-star-white/[0.015]'

  return (
    <div className={`border-b border-star-white/5 last:border-0 transition-colors ${rowBg}`}>

      {/* ── MOBILE (< md) ── */}
      <div className="md:hidden px-4 py-4">
        <div className="flex items-start gap-3 mb-3">
          {isSelectable && <div className="mt-1"><Checkbox checked={isSelected} onChange={onSelect} /></div>}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <p className="text-star-white font-mono text-[13px] font-semibold">{order.id}</p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <StatusBadge status={order.status} />
                {isShipped && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
              </div>
            </div>
            <p className="text-star-white/35 text-[11px]">{order.date}</p>
          </div>
        </div>

        <div className="pl-8 flex flex-col gap-2 mb-3">
          <p className="text-star-white text-[13px] font-medium">{order.customer.name}</p>
          <p className="text-star-white/45 text-[12px] truncate">{order.customer.email}</p>
          <div className="flex items-center gap-3">
            <span className="text-star-white/40 text-[12px]">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
            <span className="text-star-white/20 text-[10px]">·</span>
            <span className="text-star-white/35 text-[11px]">{order.payment}</span>
            {order.discount > 0 && <span className="text-green-400/70 text-[11px]">−${order.discount.toFixed(2)}</span>}
            <span className="ml-auto text-gold-400 font-bold text-[15px]">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-2 items-center pt-3 border-t border-star-white/5 pl-8">
          <div className="relative flex-1">
            <select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none w-full bg-navy-700/50 border border-star-white/10 hover:border-gold-500/40 text-star-white text-[12px] font-medium rounded-lg px-3 py-2 pr-7 outline-none cursor-pointer transition-colors"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-star-white/40" width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <button
            onClick={onShip}
            className={`p-2 rounded-lg border transition-all flex-shrink-0 ${isShipped ? 'text-green-400/70 border-green-400/20 bg-green-400/8' : 'text-star-white/40 border-star-white/10 hover:text-gold-400 hover:border-gold-500/30'}`}
          >{shipIcon}</button>
          <button
            onClick={onExpand}
            className="p-2 rounded-lg border border-star-white/10 text-star-white/35 hover:text-gold-400 hover:border-gold-500/30 transition-all flex-shrink-0"
          >{chevron}</button>
        </div>
      </div>

      {/* ── TABLET (md–xl) ── */}
      <div className="hidden md:flex xl:hidden items-center gap-3 px-4 py-3.5">
        <div className="flex-shrink-0 w-4">
          {isSelectable && <Checkbox checked={isSelected} onChange={onSelect} />}
        </div>

        {/* left: id + customer */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-star-white font-mono text-[12px] font-semibold">{order.id}</span>
            <StatusBadge status={order.status} />
            {isShipped && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
          </div>
          <p className="text-star-white/60 text-[12px] truncate mt-0.5">{order.customer.name}</p>
        </div>

        {/* middle: meta */}
        <div className="flex-shrink-0 text-right">
          <p className="text-gold-400 font-bold text-[15px]">${order.total.toFixed(2)}</p>
          <p className="text-star-white/35 text-[11px]">{itemCount} item{itemCount !== 1 ? 's' : ''} · {order.date}</p>
        </div>

        {/* right: controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="relative">
            <select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none bg-navy-700/40 border border-star-white/10 hover:border-gold-500/40 text-star-white text-[11px] font-medium rounded-lg px-2.5 py-1.5 pr-6 outline-none cursor-pointer transition-colors"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-star-white/40" width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <button
            onClick={onShip}
            className={`p-1.5 rounded-lg border transition-all ${isShipped ? 'text-green-400/60 border-green-400/20' : 'text-star-white/30 hover:text-gold-400 hover:border-gold-500/30 border-transparent'}`}
          >{shipIcon}</button>
          <button onClick={onExpand} className="text-star-white/30 hover:text-gold-400 p-1.5 transition-colors">{chevron}</button>
        </div>
      </div>

      {/* ── DESKTOP (≥ xl) ── */}
      <div className="hidden xl:grid items-center gap-0 border-b-0" style={{ gridTemplateColumns: '20px 160px 0.85fr 250px 100px 90px 180px 10px' }}>
        {/* checkbox */}
        <div className="px-2 py-4 flex items-center">
          {isSelectable && <Checkbox checked={isSelected} onChange={onSelect} />}
        </div>

        {/* order id + date */}
        <div className="px-3 py-4 flex flex-col gap-0.5">
          <p className="text-star-white font-mono text-[12px] font-semibold">{order.id}</p>
          <p className="text-star-white/30 text-[11px]">{order.date}</p>
        </div>

        {/* customer */}
        <div className="px-3 py-4 min-w-0">
          <p className="text-star-white text-[13px] font-medium truncate">{order.customer.name}</p>
          <p className="text-star-white/40 text-[11px] truncate">{order.customer.email}</p>
        </div>

        {/* address */}
        <div className="px-3 py-4 min-w-0">
          <p className="text-star-white/55 text-[11px] truncate leading-relaxed">{order.address}</p>
        </div>

        {/* items + payment */}
        <div className="px-3 py-4">
          <p className="text-star-white/60 text-[12px]">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          <p className="text-star-white/30 text-[11px]">{order.payment}</p>
        </div>

        {/* total */}
        <div className="px-3 py-4">
          <p className="text-gold-400 font-bold text-[14px]">${order.total.toFixed(2)}</p>
          {order.discount > 0 && <p className="text-green-400/70 text-[10px]">−${order.discount.toFixed(2)}</p>}
        </div>

        {/* status + status selector */}
        <div className="px-3 py-4 flex items-center gap-2 flex-wrap">
          <StatusBadge status={order.status} />
          {isShipped && <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" title="Shipped" />}
          <div className="relative mt-1 w-full">
            <select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none w-full bg-navy-700/40 border border-star-white/8 hover:border-gold-500/40 text-star-white text-[11px] font-medium rounded-lg px-2.5 py-1.5 pr-6 outline-none cursor-pointer transition-colors"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-star-white/40" width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
        </div>

        {/* actions */}
        <div className="px-3 py-4 flex flex-col gap-1.5 items-center">
          <button
            onClick={onShip}
            title={isShipped ? order.trackingNumber : 'Create shipment'}
            className={`p-1.5 rounded-lg border transition-all ${isShipped ? 'text-green-400/60 border-green-400/20' : 'text-star-white/30 hover:text-gold-400 hover:border-gold-500/30 border-transparent'}`}
          >{shipIcon}</button>
          <button onClick={onExpand} className="text-star-white/30 hover:text-gold-400 transition-colors p-1.5">{chevron}</button>
        </div>
      </div>

      {/* ── EXPANDED DETAIL (all breakpoints) ── */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-6 pt-1 border-t border-star-white/5 bg-navy-950/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-5">
            {/* Items */}
            <div className="lg:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-star-white/30 mb-3">Items ordered</p>
              <div className="flex flex-col gap-2.5">
                {order.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Image src={item.image} alt={item.name} width={36} height={36} className="w-9 h-9 rounded-lg object-cover bg-navy-600 flex-shrink-0" sizes="36px" />
                    <div className="flex-1 min-w-0">
                      <p className="text-star-white text-[13px] truncate">{item.name}</p>
                      <p className="text-star-white/35 text-[11px]">× {item.qty} · ${item.price.toFixed(2)} ea</p>
                    </div>
                    <p className="text-star-white/70 text-[13px] font-medium flex-shrink-0">${(item.qty * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-star-white/30 mb-3">Payment</p>
              <div className="bg-navy-800/60 rounded-xl p-3 flex flex-col gap-1.5">
                <div className="flex justify-between text-[12px]"><span className="text-star-white/50">Method</span><span className="text-star-white">{order.payment}</span></div>
                <div className="flex justify-between text-[12px]"><span className="text-star-white/50">Subtotal</span><span className="text-star-white">${order.subtotal.toFixed(2)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-[12px]"><span className="text-green-400/70">Discount</span><span className="text-green-400">−${order.discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-[13px] font-bold pt-1.5 border-t border-star-white/10 mt-0.5"><span className="text-star-white/70">Total</span><span className="text-gold-400">${order.total.toFixed(2)}</span></div>
              </div>
              <div className="mt-2 text-[11px] text-star-white/30 leading-relaxed">{order.customer.phone}</div>
              <div className="mt-0.5 text-[11px] text-star-white/25 leading-relaxed">{order.address}</div>
            </div>

            {/* Shipping */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-star-white/30 mb-3">Shipping</p>
              {order.trackingNumber ? (
                <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-3 flex flex-col gap-2">
                  <div className={`self-start px-2 py-0.5 rounded-full text-[10px] font-semibold border ${CARRIER_COLORS[order.carrier ?? ''] ?? 'text-star-white/50 bg-star-white/5 border-star-white/10'}`}>
                    {carrierLabel(order.carrier ?? '')}
                  </div>
                  <p className="text-star-white text-[12px] font-mono break-all">{order.trackingNumber}</p>
                  <a href={trackingUrl(order.carrier ?? '', order.trackingNumber)} target="_blank" rel="noopener noreferrer"
                    className="text-gold-400 text-[12px] hover:text-gold-300 transition-colors inline-flex items-center">Track <ArrowIcon size={12} className="ml-1" /></a>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={onShip}
                    className="w-full py-2.5 rounded-xl bg-gold-500/12 border border-gold-500/25 text-gold-400 text-[13px] font-semibold hover:bg-gold-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13" /><path d="m16 8 5 0 3 5v3h-8V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                    Create Shipment
                  </button>
                  {order.status !== 'Cancelled' && (
                    <button
                      disabled={!!syncingId}
                      onClick={onSync}
                      className="w-full py-2 rounded-xl border border-star-white/8 text-star-white/40 hover:text-star-white/60 text-[12px] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {syncingId === order.id ? <><Spinner size={13} /> Syncing…</> : 'Sync to ShipStation'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Admin component ──────────────────────────────────────────────────────────

export default function Admin() {
  const router = useRouter()
  const {
    user, orders, products,
    updateOrderStatus, updateOrderShipping,
    addProduct, deleteProduct, toggleFeatured, logout,
  } = useStore()

  const [tab, setTab] = useState('orders')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')
  const [orderSearch, setOrderSearch] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [toast, setToast] = useState('')
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [productSearch, setProductSearch] = useState('')

  const [newProduct, setNewProduct] = useState({
    name: '', category: 'churros', price: '', price6plus: '', parkPrice: '',
    rating: '', reviewCount: '', weight: '', description: '', image: '',
    available: true, featured: false,
  })
  const [formErrors, setFormErrors] = useState({})
  const [uploadError, setUploadError] = useState('')

  // Shipping runs in local demo mode — simulated rates and labels
  const [shipFrom, setShipFrom] = useState(DEFAULT_FROM)

  // Single-order shipping panel
  const [shippingOrderId, setShippingOrderId] = useState(null)
  const [ssRates, setSsRates] = useState([])
  const [ssRatesLoading, setSsRatesLoading] = useState(false)
  const [selectedRate, setSelectedRate] = useState(null)
  const [labelCreating, setLabelCreating] = useState(false)
  const [labelResult, setLabelResult] = useState(null)
  const [syncingId, setSyncingId] = useState(null)

  // Bulk label generation
  const [selectedOrders, setSelectedOrders] = useState(new Set())
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkCarrier, setBulkCarrier] = useState('stamps_com')
  const [bulkService, setBulkService] = useState('usps_priority_mail')
  const [bulkProgress, setBulkProgress] = useState(new Map())
  const [bulkLabels, setBulkLabels] = useState(new Map())
  const [bulkRunning, setBulkRunning] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const toggleOrderSelect = (id) => {
    setSelectedOrders((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function filteredOrdersList() {
    return orders
      .filter((o) => statusFilter === 'All' || o.status === statusFilter)
      .filter((o) => {
        const q = orderSearch.toLowerCase()
        return !q || o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q)
      })
  }

  const filteredOrders = filteredOrdersList()
  const allSelectableIds = filteredOrders.filter((o) => o.status !== 'Cancelled').map((o) => o.id)
  const allSelected = allSelectableIds.length > 0 && allSelectableIds.every((id) => selectedOrders.has(id))
  const someSelected = allSelectableIds.some((id) => selectedOrders.has(id))

  const toggleSelectAll = () => {
    if (allSelected) setSelectedOrders(new Set())
    else setSelectedOrders(new Set(allSelectableIds))
  }

  const openShippingPanel = (orderId) => {
    setShippingOrderId(orderId)
    setSsRates([])
    setSelectedRate(null)
    setLabelResult(null)
  }

  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(orderId, status)
    showToast(`Order ${orderId} → ${status}`)
  }

  const openBulkModal = () => {
    setBulkProgress(new Map())
    setBulkLabels(new Map())
    setBulkRunning(false)
    setShowBulkModal(true)
  }

  const runBulkLabels = async () => {
    setBulkRunning(true)
    const ids = Array.from(selectedOrders)
    setBulkProgress(new Map(ids.map((id) => [id, 'pending'])))
    const svc = BULK_SERVICES.find((s) => s.carrier === bulkCarrier && s.service === bulkService)

    for (const orderId of ids) {
      const order = orders.find((o) => o.id === orderId)
      if (!order) continue
      setBulkProgress((prev) => new Map(prev).set(orderId, 'creating'))
      const rate = {
        carrierCode: bulkCarrier, serviceCode: bulkService,
        serviceName: svc.name, shipmentCost: 0, otherCost: 0, days: svc.days,
      }
      try {
        const label = await createShippingLabel(order, rate, orderWeight(order), shipFrom)
        setBulkLabels((prev) => new Map(prev).set(orderId, label))
        updateOrderShipping(orderId, label.trackingNumber, bulkCarrier)
        updateOrderStatus(orderId, 'Dispatched')
        setBulkProgress((prev) => new Map(prev).set(orderId, 'done'))
      } catch {
        setBulkProgress((prev) => new Map(prev).set(orderId, 'error'))
      }
    }
    setBulkRunning(false)
  }

  const filteredProducts = products.filter((p) =>
    !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.includes(productSearch.toLowerCase())
  )

  const validateProduct = () => {
    const e = {}
    if (!newProduct.name.trim()) e.name = 'Required'
    if (newProduct.available) {
      if (!newProduct.price || isNaN(+newProduct.price)) e.price = 'Valid price required'
      if (!newProduct.price6plus || isNaN(+newProduct.price6plus)) e.price6plus = 'Required'
    }
    if (!newProduct.weight.trim()) e.weight = 'Required'
    if (!newProduct.description.trim()) e.description = 'Required'
    if (newProduct.rating !== '' && (isNaN(+newProduct.rating) || +newProduct.rating < 0 || +newProduct.rating > 5))
      e.rating = '0–5'
    if (newProduct.reviewCount !== '' && (isNaN(+newProduct.reviewCount) || +newProduct.reviewCount < 0))
      e.reviewCount = 'Invalid'
    return e
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    const errs = validateProduct()
    if (Object.keys(errs).length) {
      setFormErrors(errs)
      return
    }
    const product = {
      id: Date.now(), name: newProduct.name, category: newProduct.category,
      price: newProduct.available ? +newProduct.price : null,
      price6plus: newProduct.available ? +newProduct.price6plus : null,
      parkPrice: newProduct.parkPrice !== '' ? +newProduct.parkPrice : null,
      rating: newProduct.rating !== '' ? +newProduct.rating : 4.9,
      reviewCount: newProduct.reviewCount !== '' ? +newProduct.reviewCount : 124,
      weight: newProduct.weight,
      description: newProduct.description,
      image: newProduct.image || PRODUCT_IMAGE_FALLBACK,
      available: newProduct.available,
      featured: newProduct.featured,
    }
    addProduct(product)
    setNewProduct({ name: '', category: 'churros', price: '', price6plus: '', parkPrice: '', rating: '', reviewCount: '', weight: '', description: '', image: '', available: true, featured: false })
    setFormErrors({})
    setUploadError('')
    setShowAddPanel(false)
    showToast(`"${product.name}" added to catalogue`)
  }

  const formField = (key, label, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-star-white/50">{label}</label>
      <input type={type} value={newProduct[key]} placeholder={placeholder}
        onChange={(e) => setNewProduct((p) => ({ ...p, [key]: e.target.value }))}
        className={`bg-navy-950/60 border rounded-lg px-3 py-2 text-star-white text-[13px] placeholder:text-star-white/20 outline-none focus:border-gold-500/50 transition-colors ${formErrors[key] ? 'border-red-400/50' : 'border-star-white/10'}`} />
      {formErrors[key] && <p className="text-red-400 text-[11px]">{formErrors[key]}</p>}
    </div>
  )

  const formToggle = (key, label, hint = '') => (
    <div className="flex items-center justify-between gap-3">
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-star-white/50">{label}</label>
        {hint && <p className="text-star-white/30 text-[11px] mt-0.5">{hint}</p>}
      </div>
      <button type="button" onClick={() => setNewProduct((p) => ({ ...p, [key]: !p[key] }))}
        aria-pressed={newProduct[key]}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${newProduct[key] ? 'bg-gold-500' : 'bg-star-white/15'}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${newProduct[key] ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  )

  const placed     = orders.filter((o) => o.status === 'Placed').length
  const dispatched = orders.filter((o) => o.status === 'Dispatched').length
  const revenue    = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0)
  const shippingOrder = shippingOrderId ? orders.find((o) => o.id === shippingOrderId) ?? null : null

  const shipIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" /><path d="m16 8 5 0 3 5v3h-8V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )

  const bulkDone  = Array.from(bulkProgress.values()).filter((v) => v === 'done').length
  const bulkTotal = bulkProgress.size

  const tabs = [
    {
      key: 'orders', label: 'Orders',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    },
    {
      key: 'products', label: 'Products',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
    },
  ]

  // Admin gate — mirrors the original: non-admin visitors see the login screen
  if (!user?.isAdmin) {
    return <LoginForm intendedAdmin />
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D1828', fontFamily: 'var(--font-sans)' }}>
      {toast && <ToastNotif msg={toast} />}

      {/* Top bar */}
      <header className="bg-navy-950 border-b border-star-white/5 h-14 flex items-center px-4 sm:px-6 gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 mr-auto min-w-0">
          <img src="/logo.png" alt="Uncle Walt's Churros" className="h-8 w-8 object-contain flex-shrink-0" />
          <span className="text-star-white font-semibold text-sm tracking-tight">Uncle <span className="text-gold-400">Walt&apos;s</span></span>
          <span className="text-star-white/20 mx-0.5">/</span>
          <span className="text-star-white/50 text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-500 text-[11px] font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-star-white/60 text-[13px] hidden sm:block max-w-[120px] truncate">{user.name}</span>
          <button onClick={() => { logout(); router.push('/') }} className="text-[12px] text-star-white/30 hover:text-star-white/70 border border-star-white/10 hover:border-star-white/25 px-2.5 py-1.5 rounded-lg transition-all">
            Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`transition-all duration-200 ease-in-out ${sidebarCollapsed ? 'w-12' : 'w-12 sm:w-52'} bg-navy-950/60 border-r border-star-white/5 flex flex-col flex-shrink-0 overflow-hidden`}>
          <div className="hidden sm:flex justify-end px-2 pt-3 pb-1 flex-shrink-0">
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-star-white/20 hover:text-star-white/60 hover:bg-star-white/5 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {sidebarCollapsed
                  ? <><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></>
                  : <><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></>
                }
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-1.5 pb-4 flex-1">
            {tabs.map((item) => (
              <button key={item.key} onClick={() => setTab(item.key)}
                className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all duration-150 ${tab === item.key ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20' : 'text-star-white/40 hover:text-star-white/70 hover:bg-star-white/5'}`}>
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`text-[13px] font-medium whitespace-nowrap overflow-hidden transition-all duration-200 ${sidebarCollapsed ? 'w-0 opacity-0' : 'w-0 sm:w-auto opacity-0 sm:opacity-100'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">

          {/* ══ ORDERS TAB ══ */}
          {tab === 'orders' && (
            <div className="max-w-7xl mx-auto">
              <div className="mb-5">
                <h1 className="text-star-white text-xl sm:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>Orders</h1>
                <p className="text-star-white/40 text-[12px] mt-0.5">{orders.length} total · {placed} pending · {dispatched} in transit</p>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
                {[
                  { label: 'Total',      value: orders.length,            color: 'text-star-white' },
                  { label: 'Pending',    value: placed,                   color: 'text-blue-300' },
                  { label: 'In transit', value: dispatched,               color: 'text-amber-300' },
                  { label: 'Revenue',    value: `$${revenue.toFixed(0)}`, color: 'text-gold-400' },
                ].map((s) => (
                  <div key={s.label} className="bg-navy-800/50 border border-star-white/5 rounded-xl px-3 sm:px-4 py-3">
                    <p className={`text-lg sm:text-xl font-bold ${s.color}`} style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
                    <p className="text-star-white/35 text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <div className="relative flex-1 sm:max-w-xs">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-star-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search order or customer…"
                    className="w-full bg-navy-800/60 border border-star-white/10 rounded-lg pl-9 pr-3 py-2 text-star-white text-[13px] placeholder:text-star-white/25 outline-none focus:border-gold-500/40 transition-colors" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {['All', ...STATUSES].map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${statusFilter === s ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'text-star-white/40 border border-star-white/8 hover:text-star-white/60'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk action bar */}
              {someSelected && (
                <div className="flex items-center gap-3 bg-gold-500/8 border border-gold-500/20 rounded-xl px-4 py-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-500 text-[11px] font-bold flex-shrink-0">
                    {selectedOrders.size}
                  </div>
                  <p className="text-star-white/70 text-[13px] flex-1">{selectedOrders.size} order{selectedOrders.size !== 1 ? 's' : ''} selected</p>
                  <button onClick={openBulkModal}
                    className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-[12px] sm:text-[13px] px-3 sm:px-3.5 py-2 rounded-lg transition-all">
                    {shipIcon}
                    <span className="hidden sm:inline">Bulk </span>Create Labels
                  </button>
                  <button onClick={() => setSelectedOrders(new Set())} className="text-star-white/30 hover:text-star-white/70 text-xl leading-none p-1">×</button>
                </div>
              )}

              {/* Orders table */}
              <div className="bg-navy-800/40 border border-star-white/6 rounded-2xl overflow-hidden">
                {/* Desktop header (xl+) */}
                <div className="hidden xl:grid items-center border-b border-star-white/6 text-[10px] font-semibold uppercase tracking-widest text-star-white/25"
                  style={{ gridTemplateColumns: '20px 160px 0.85fr 200px 100px 90px 180px 30px' }}>
                  <div className="px-2 py-4 flex items-center">
                    <Checkbox checked={allSelected} onChange={toggleSelectAll} />
                  </div>
                  <span className="px-3 py-3">Order</span>
                  <span className="px-3 py-3">Customer</span>
                  <span className="px-3 py-3">Address</span>
                  <span className="px-3 py-3">Items</span>
                  <span className="px-3 py-3">Total</span>
                  <span className="px-3 py-3">Status</span>
                  <span className="px-3 py-3">Actions</span>
                </div>

                {/* Tablet header (md–xl) */}
                <div className="hidden md:flex xl:hidden items-center gap-3 px-4 py-3.5 border-b border-star-white/6 text-[10px] font-semibold uppercase tracking-widest text-star-white/25">
                  <div className="w-4 flex-shrink-0">
                    <Checkbox checked={allSelected} onChange={toggleSelectAll} />
                  </div>
                  <span className="flex-1">Order / Customer</span>
                  <span>Total / Date</span>
                  <span className="w-[140px] text-right">Actions</span>
                </div>

                {filteredOrders.length === 0 && !orderSearch && (
                  <div className="py-6">
                    {Array.from({ length: 4 }).map((_, i) => <OrderRowSkeleton key={i} />)}
                  </div>
                )}

                {filteredOrders.length === 0 && orderSearch && (
                  <div className="py-16 text-center text-star-white/30 text-[14px]">No orders match your filters.</div>
                )}

                {filteredOrders.map((order, i) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    index={i}
                    isSelected={selectedOrders.has(order.id)}
                    isSelectable={order.status !== 'Cancelled'}
                    isExpanded={expandedOrder === order.id}
                    syncingId={syncingId}
                    onSelect={() => toggleOrderSelect(order.id)}
                    onStatusChange={(s) => handleStatusChange(order.id, s)}
                    onShip={() => openShippingPanel(order.id)}
                    onExpand={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    onSync={async () => {
                      setSyncingId(order.id)
                      const result = await syncToShippingProvider(order)
                      setSyncingId(null)
                      if (result) showToast(`${order.id} synced to shipping provider`)
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ══ PRODUCTS TAB ══ */}
          {tab === 'products' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-star-white text-xl sm:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>Products</h1>
                  <p className="text-star-white/40 text-[12px] mt-0.5">{products.length} in catalogue</p>
                </div>
                <button onClick={() => setShowAddPanel(true)}
                  className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-[13px] px-4 py-2.5 rounded-xl transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  Add Product
                </button>
              </div>
              <div className="relative mb-4 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-star-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products…"
                  className="w-full bg-navy-800/60 border border-star-white/10 rounded-lg pl-9 pr-3 py-2 text-star-white text-[13px] placeholder:text-star-white/25 outline-none focus:border-gold-500/40 transition-colors" />
              </div>
              <div className="bg-navy-800/40 border border-star-white/6 rounded-2xl overflow-hidden">
                <div className="hidden md:grid grid-cols-[52px_1fr_100px_80px_85px_72px_88px] gap-3 px-5 py-3 border-b border-star-white/6 text-[10px] font-semibold uppercase tracking-widest text-star-white/25">
                  <span /><span>Product</span><span>Category</span><span>Price</span><span>Bulk</span><span>Featured</span><span>Actions</span>
                </div>
                {filteredProducts.length === 0 && !productSearch && (
                  <div className="py-4">
                    {Array.from({ length: 3 }).map((_, i) => <ProductRowSkeleton key={i} />)}
                  </div>
                )}
                {filteredProducts.length === 0 && productSearch && (
                  <div className="py-16 text-center text-star-white/30 text-[14px]">No products found.</div>
                )}
                {filteredProducts.map((p, i) => (
                  <div key={p.id} className={`border-b border-star-white/5 last:border-0 ${i % 2 === 0 ? '' : 'bg-star-white/[0.015]'}`}>
                    <div className="md:hidden flex items-center gap-3 px-4 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-navy-600 flex-shrink-0">
                        <Image src={p.image} alt={p.name} width={48} height={48} className="w-full h-full object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-star-white text-[14px] font-medium truncate">{p.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="capitalize text-[11px] px-2 py-0.5 rounded-full border border-star-white/10 text-star-white/45">{p.category}</span>
                          <span className="text-gold-400 text-[13px] font-semibold">{p.price != null ? `$${p.price.toFixed(2)}` : '—'}</span>
                          <span className="text-star-white/35 text-[11px]">{p.price6plus != null ? `bulk $${p.price6plus.toFixed(2)}` : 'coming soon'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button onClick={() => { toggleFeatured(p.id); showToast(`"${p.name}" ${p.featured ? 'removed from' : 'added to'} featured`) }}
                          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${p.featured ? 'bg-gold-500' : 'bg-star-white/15'}`} aria-label="Toggle featured">
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${p.featured ? 'left-5' : 'left-0.5'}`} />
                        </button>
                        <button onClick={() => { deleteProduct(p.id); showToast(`"${p.name}" removed`) }}
                          className="text-[11px] text-red-400/60 hover:text-red-400 border border-red-400/15 hover:border-red-400/35 px-2 py-1 rounded-lg transition-all">
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="hidden md:grid grid-cols-[52px_1fr_100px_80px_85px_72px_88px] gap-3 px-5 py-4 items-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-navy-600">
                        <Image src={p.image} alt={p.name} width={40} height={40} className="w-full h-full object-cover" sizes="40px" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-star-white text-[14px] font-medium truncate">{p.name}</p>
                        <p className="text-star-white/35 text-[12px] truncate">{p.weight}</p>
                      </div>
                      <span className="capitalize text-[12px] px-2.5 py-0.5 rounded-full border border-star-white/10 text-star-white/50 w-fit">{p.category}</span>
                      <p className="text-gold-400 font-semibold text-[14px]">{p.price != null ? `$${p.price.toFixed(2)}` : '—'}</p>
                      <p className="text-star-white/60 text-[13px]">{p.price6plus != null ? `$${p.price6plus.toFixed(2)}` : 'coming soon'}</p>
                      <button onClick={() => { toggleFeatured(p.id); showToast(`"${p.name}" ${p.featured ? 'removed from' : 'added to'} featured`) }}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${p.featured ? 'bg-gold-500' : 'bg-star-white/15'}`} aria-label="Toggle featured">
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${p.featured ? 'left-5' : 'left-0.5'}`} />
                      </button>
                      <button onClick={() => { deleteProduct(p.id); showToast(`"${p.name}" removed from catalogue`) }}
                        className="text-[12px] text-red-400/60 hover:text-red-400 border border-red-400/15 hover:border-red-400/35 px-2.5 py-1.5 rounded-lg transition-all w-fit">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══ ADD PRODUCT PANEL ══ */}
      {showAddPanel && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setShowAddPanel(false)} />
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-navy-950 border-l border-star-white/8 flex flex-col shadow-2xl"
            style={{ animation: 'hero-copy-up 0.25s ease' }}>
            <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-star-white/8 flex-shrink-0">
              <h2 className="text-star-white text-lg" style={{ fontFamily: 'var(--font-display)' }}>Add new product</h2>
              <button onClick={() => setShowAddPanel(false)} className="text-star-white/40 hover:text-star-white text-2xl leading-none p-1">×</button>
            </div>
            <form onSubmit={handleAddProduct} className="flex-1 overflow-auto px-5 sm:px-6 py-5 flex flex-col gap-4">
              <ImageDropzone value={newProduct.image} onChange={(url) => setNewProduct((p) => ({ ...p, image: url }))} onError={setUploadError} />
              {uploadError && <p className="text-red-400 text-[11px] -mt-2">{uploadError}</p>}
              {formField('name', 'Product name', 'text', 'e.g. Dulce de Leche Churros')}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-star-white/50">Category</label>
                <select value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                  className="bg-navy-950/60 border border-star-white/10 rounded-lg px-3 py-2 text-star-white text-[13px] outline-none focus:border-gold-500/50 transition-colors">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-star-white/8 bg-navy-800/30 p-3">
                  {formToggle('available', 'Available for sale', 'Off = Coming Soon')}
                </div>
                <div className="rounded-xl border border-star-white/8 bg-navy-800/30 p-3">
                  {formToggle('featured', 'Feature on home', 'Shows in hero grid')}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {formField('price', 'Regular price ($)', 'number', '12.99')}
                {formField('price6plus', 'Bulk price 6+ ($)', 'number', '11.69')}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {formField('parkPrice', 'Park price ($)', 'number', '94.95 — for Save $')}
                {formField('rating', 'Rating (0–5)', 'number', '4.9')}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {formField('weight', 'Weight / pack size', 'text', '6 churros · 480g')}
                {formField('reviewCount', 'Review count', 'number', '124')}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-star-white/50">Description</label>
                <textarea value={newProduct.description} rows={3} placeholder="Short, warm product description…"
                  onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                  className={`bg-navy-950/60 border rounded-lg px-3 py-2 text-star-white text-[13px] placeholder:text-star-white/20 outline-none focus:border-gold-500/50 transition-colors resize-none ${formErrors.description ? 'border-red-400/50' : 'border-star-white/10'}`} />
                {formErrors.description && <p className="text-red-400 text-[11px]">{formErrors.description}</p>}
              </div>
              <div className="flex gap-3 pt-2 border-t border-star-white/8">
                <button type="button" onClick={() => setShowAddPanel(false)}
                  className="flex-1 py-2.5 rounded-xl border border-star-white/10 text-star-white/60 hover:text-star-white text-[13px] font-medium transition-colors">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-[13px] transition-all">Add to catalogue</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ══ SINGLE ORDER SHIPPING PANEL ══ */}
      {shippingOrder && (() => {
        const order = shippingOrder
        const wt = orderWeight(order)
        const lastPart = order.address.split(', ').at(-1) ?? ''
        const toState = lastPart.match(/([A-Z]{2})/)?.[0] ?? 'CA'
        const toZip   = lastPart.match(/(\d{5})/)?.[1] ?? '90001'

        return (
          <>
            <div className="fixed inset-0 bg-black/55 z-40 backdrop-blur-sm" onClick={() => setShippingOrderId(null)} />
            <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-navy-950 border-l border-star-white/8 flex flex-col shadow-2xl"
              style={{ animation: 'hero-copy-up 0.25s ease' }}>
              <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-star-white/8 flex-shrink-0">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-star-white/30 mb-0.5">Create Shipment</p>
                  <h2 className="text-star-white text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{order.id}</h2>
                </div>
                <button onClick={() => setShippingOrderId(null)} className="text-star-white/40 hover:text-star-white text-2xl leading-none p-1">×</button>
              </div>
              <div className="flex-1 overflow-auto px-5 sm:px-6 py-5 flex flex-col gap-4">
                <div className="bg-navy-800/50 border border-star-white/6 rounded-xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-star-white/30 mb-2">Ship to</p>
                  <p className="text-star-white text-[14px] font-medium">{order.customer.name}</p>
                  <p className="text-star-white/50 text-[13px] mt-0.5 leading-relaxed">{order.address}</p>
                  <div className="flex gap-5 mt-3 pt-3 border-t border-star-white/6">
                    <div><p className="text-star-white/30 text-[11px] uppercase tracking-wider">Est. weight</p><p className="text-star-white text-[13px] font-medium mt-0.5">{wt} lbs</p></div>
                    <div><p className="text-star-white/30 text-[11px] uppercase tracking-wider">Items</p><p className="text-star-white text-[13px] font-medium mt-0.5">{order.items.reduce((s, i) => s + i.qty, 0)} pcs</p></div>
                    <div><p className="text-star-white/30 text-[11px] uppercase tracking-wider">Value</p><p className="text-gold-400 text-[13px] font-semibold mt-0.5">${order.total.toFixed(2)}</p></div>
                  </div>
                </div>

                {order.trackingNumber && !labelResult && (
                  <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-4">
                    <p className="text-green-400 text-[11px] uppercase tracking-wider font-semibold mb-2">Already shipped ✓</p>
                    <p className="text-star-white text-[13px] font-mono break-all">{order.trackingNumber}</p>
                    <a href={trackingUrl(order.carrier ?? '', order.trackingNumber)} target="_blank" rel="noopener noreferrer"
                      className="text-gold-400 text-[12px] hover:text-gold-300 mt-2 inline-flex items-center">Track <ArrowIcon size={12} className="ml-1" /></a>
                  </div>
                )}

                {labelResult && (
                  <div className="bg-green-500/8 border border-green-500/20 rounded-xl p-4 flex flex-col gap-2">
                    <p className="text-green-400 text-[11px] uppercase tracking-wider font-semibold">Label created ✓</p>
                    <div className={`self-start inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${CARRIER_COLORS[labelResult.carrierCode] ?? 'text-star-white/50 bg-star-white/5 border-star-white/10'}`}>
                      {carrierLabel(labelResult.carrierCode)} · {selectedRate?.serviceName}
                    </div>
                    <p className="text-star-white text-[13px] font-mono font-medium break-all">{labelResult.trackingNumber}</p>
                    <div className="flex justify-between pt-1.5 border-t border-star-white/8">
                      <span className="text-star-white/40 text-[12px]">Cost</span>
                      <span className="text-gold-400 font-semibold text-[13px]">${labelResult.cost.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {!labelResult && (
                  <div className="bg-amber-500/8 border border-amber-400/20 rounded-xl p-3">
                    <p className="text-amber-300/80 text-[12px] leading-relaxed">
                      <span className="font-semibold text-amber-300">Demo mode</span> — simulated rates are being used.
                    </p>
                  </div>
                )}

                {ssRates.length === 0 && !ssRatesLoading && !labelResult && (
                  <button onClick={async () => {
                    setSsRatesLoading(true)
                    const rates = await getShippingRates({ state: toState, zip: toZip }, wt)
                    setSsRates(rates)
                    setSsRatesLoading(false)
                  }}
                    className="w-full py-3 rounded-xl bg-[#00A4B4]/12 border border-[#00A4B4]/30 text-[#00A4B4] text-[14px] font-semibold hover:bg-[#00A4B4]/20 transition-colors flex items-center justify-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" /></svg>
                    Get Shipping Rates
                  </button>
                )}

                {ssRatesLoading && (
                  <div className="flex items-center justify-center py-10 gap-3">
                    <Spinner size={18} color="rgba(248,247,242,0.4)" />
                    <p className="text-star-white/40 text-[13px]">Fetching rates…</p>
                  </div>
                )}

                {ssRates.length > 0 && !labelResult && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-star-white/30 mb-3">Available rates</p>
                    <div className="flex flex-col gap-2">
                      {ssRates.map((rate) => {
                        const total = rate.shipmentCost + rate.otherCost
                        const isSel = selectedRate?.serviceCode === rate.serviceCode
                        return (
                          <button key={rate.serviceCode} onClick={() => setSelectedRate(rate)}
                            className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${isSel ? 'bg-gold-500/12 border-gold-500/40' : 'bg-navy-800/40 border-star-white/8 hover:border-star-white/20'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSel ? 'border-gold-500 bg-gold-500' : 'border-star-white/25'}`}>
                                {isSel && <div className="w-1.5 h-1.5 rounded-full bg-navy-950" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${CARRIER_COLORS[rate.carrierCode] ?? 'text-star-white/40 bg-star-white/5 border-star-white/10'}`}>{carrierLabel(rate.carrierCode)}</span>
                                  <p className={`text-[13px] font-medium ${isSel ? 'text-gold-400' : 'text-star-white'}`}>{rate.serviceName.replace(/^(USPS|UPS|FedEx)\s+/i, '')}</p>
                                </div>
                                <p className="text-star-white/35 text-[11px] mt-0.5">{rate.days ? `Est. ${rate.days} day${rate.days !== 1 ? 's' : ''}` : 'Varies'}</p>
                              </div>
                            </div>
                            <p className={`text-[15px] font-bold flex-shrink-0 ml-3 ${isSel ? 'text-gold-400' : 'text-star-white/70'}`}>${total.toFixed(2)}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {selectedRate && !labelResult && (
                  <button disabled={labelCreating}
                    onClick={async () => {
                      setLabelCreating(true)
                      const label = await createShippingLabel(order, selectedRate, wt, shipFrom)
                      setLabelResult(label)
                      updateOrderShipping(order.id, label.trackingNumber, selectedRate.carrierCode)
                      updateOrderStatus(order.id, 'Dispatched')
                      setLabelCreating(false)
                      showToast(`Label · ${label.trackingNumber}`)
                    }}
                    className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold text-[14px] transition-all flex items-center justify-center gap-2">
                    {labelCreating ? <><Spinner size={15} color="#0B1226" /> Creating…</> : `Purchase Label — ${carrierLabel(selectedRate.carrierCode)} $${(selectedRate.shipmentCost + selectedRate.otherCost).toFixed(2)}`}
                  </button>
                )}

                {labelResult && (
                  <button onClick={() => setShippingOrderId(null)}
                    className="w-full py-3 rounded-xl border border-star-white/10 text-star-white/60 hover:text-star-white text-[13px] font-medium transition-colors">
                    Close
                  </button>
                )}
              </div>
            </div>
          </>
        )
      })()}

      {/* ══ BULK LABEL MODAL ══ */}
      {showBulkModal && (() => {
        const bulkOrdersList = Array.from(selectedOrders).map((id) => orders.find((o) => o.id === id)).filter(Boolean)
        const isRunning = bulkRunning
        const isDone = !isRunning && bulkProgress.size > 0
        const canGenerate = !isRunning && bulkProgress.size === 0

        return (
          <>
            <div className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm" onClick={() => !isRunning && setShowBulkModal(false)} />
            <div className="fixed inset-3 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[88vh] z-[51] bg-navy-950 border border-star-white/8 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-star-white/8 flex-shrink-0">
                <div>
                  <h2 className="text-star-white text-lg" style={{ fontFamily: 'var(--font-display)' }}>Bulk Label Generation</h2>
                  <p className="text-star-white/40 text-[13px] mt-0.5">{selectedOrders.size} orders · {BULK_SERVICES.find((s) => s.carrier === bulkCarrier && s.service === bulkService)?.name ?? 'Custom service'}</p>
                </div>
                {!isRunning && <button onClick={() => setShowBulkModal(false)} className="text-star-white/40 hover:text-star-white text-2xl leading-none p-1">×</button>}
              </div>

              <div className="flex-1 overflow-auto px-5 sm:px-6 py-5 flex flex-col gap-5">
                {canGenerate && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-star-white/40 mb-3">Shipping service — applied to all orders</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BULK_SERVICES.map((svc) => {
                        const isSel = bulkCarrier === svc.carrier && bulkService === svc.service
                        return (
                          <button key={svc.service}
                            onClick={() => { setBulkCarrier(svc.carrier); setBulkService(svc.service) }}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isSel ? 'bg-gold-500/12 border-gold-500/35' : 'bg-navy-800/40 border-star-white/8 hover:border-star-white/20'}`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSel ? 'border-gold-500 bg-gold-500' : 'border-star-white/25'}`}>
                              {isSel && <div className="w-1.5 h-1.5 rounded-full bg-navy-950" />}
                            </div>
                            <div>
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${CARRIER_COLORS[svc.carrier] ?? 'text-star-white/40 bg-star-white/5 border-star-white/10'}`}>{carrierLabel(svc.carrier)}</span>
                                <span className={`text-[13px] font-medium ${isSel ? 'text-gold-400' : 'text-star-white'}`}>{svc.name.replace(/^(USPS|UPS|FedEx)\s+/i, '')}</span>
                              </div>
                              <p className="text-star-white/35 text-[11px] mt-0.5">Est. {svc.days} business day{svc.days !== 1 ? 's' : ''}</p>
                            </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {(isRunning || isDone) && (
                  <div className="bg-navy-800/50 border border-star-white/6 rounded-xl px-4 py-3 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-star-white text-[13px] font-medium">
                          {isRunning ? 'Creating labels…' : `${bulkDone} of ${bulkTotal} labels created`}
                        </p>
                        <p className="text-star-white/40 text-[12px]">{bulkDone}/{bulkTotal}</p>
                      </div>
                      <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500 rounded-full transition-all duration-300"
                          style={{ width: bulkTotal > 0 ? `${(bulkDone / bulkTotal) * 100}%` : '0%' }} />
                      </div>
                    </div>
                    {isRunning && <Spinner size={18} color="rgba(201,150,44,0.7)" />}
                    {isDone && <span className="text-green-400 text-[18px]">✓</span>}
                  </div>
                )}

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-star-white/30 mb-3">Orders ({bulkOrdersList.length})</p>
                  <div className="flex flex-col gap-2">
                    {bulkOrdersList.map((order) => {
                      const progress = bulkProgress.get(order.id)
                      const label = bulkLabels.get(order.id)
                      const wt = orderWeight(order)
                      return (
                        <div key={order.id} className={`bg-navy-800/40 border rounded-xl p-4 flex items-start gap-4 transition-colors ${
                          progress === 'done'     ? 'border-green-500/25 bg-green-500/5' :
                          progress === 'error'    ? 'border-red-500/25 bg-red-500/5' :
                          progress === 'creating' ? 'border-gold-500/25' : 'border-star-white/8'
                        }`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-star-white font-mono text-[13px] font-semibold">{order.id}</p>
                              <span className="text-star-white/25">·</span>
                              <p className="text-star-white/70 text-[13px] truncate">{order.customer.name}</p>
                            </div>
                            <p className="text-star-white/40 text-[12px] truncate">{order.address}</p>
                            <p className="text-star-white/30 text-[11px] mt-1">{wt} lbs · {order.items.reduce((s, i) => s + i.qty, 0)} items · ${order.total.toFixed(2)}</p>
                            {label && <p className="text-green-400 text-[11px] font-mono mt-1.5 break-all">{label.trackingNumber}</p>}
                          </div>
                          <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                            {!progress           && <span className="text-star-white/20 text-[13px]">—</span>}
                            {progress === 'pending'  && <span className="text-star-white/30 text-[12px]">…</span>}
                            {progress === 'creating' && <Spinner size={14} color="rgba(201,150,44,0.8)" />}
                            {progress === 'done'     && <span className="text-green-400 text-[16px]">✓</span>}
                            {progress === 'error'    && <span className="text-red-400 text-[16px]">✗</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="px-5 sm:px-6 py-4 border-t border-star-white/8 flex gap-3 flex-shrink-0">
                {canGenerate && (
                  <>
                    <button onClick={() => setShowBulkModal(false)}
                      className="flex-1 py-3 rounded-xl border border-star-white/10 text-star-white/60 hover:text-star-white text-[13px] font-medium transition-colors">
                      Cancel
                    </button>
                    <button onClick={runBulkLabels}
                      className="flex-1 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-[14px] transition-all flex items-center justify-center gap-2">
                      {shipIcon} Generate {selectedOrders.size} Label{selectedOrders.size !== 1 ? 's' : ''}
                    </button>
                  </>
                )}
                {isRunning && (
                  <div className="flex-1 flex items-center justify-center gap-2 py-3 text-star-white/40 text-[13px]">
                    <Spinner size={14} /> Creating labels — do not close this window
                  </div>
                )}
                {isDone && (
                  <button onClick={() => { setShowBulkModal(false); setSelectedOrders(new Set()); setBulkProgress(new Map()); setBulkLabels(new Map()) }}
                    className="flex-1 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-[14px] transition-all">
                    Done — {bulkDone} label{bulkDone !== 1 ? 's' : ''} created ✓
                  </button>
                )}
              </div>
            </div>
          </>
        )
      })()}
    </div>
  )
}