// ShipStation REST API integration
// Base: https://ssapi.shipstation.com  |  Auth: Basic base64(apiKey:apiSecret)
// In production, route these calls through a backend proxy to avoid CORS and credential exposure.
// Every call falls back to simulated (demo) responses when the network request fails.

const SS_BASE = 'https://ssapi.shipstation.com'

function authHeader(key, secret) {
  return `Basic ${btoa(`${key}:${secret}`)}`
}

function mockRates(toState) {
  const base = ['CA', 'OR', 'WA', 'NV', 'AZ'].includes(toState) ? 7.4 : toState === 'TX' ? 8.1 : 9.3
  return [
    {
      carrierCode: 'stamps_com',
      serviceCode: 'usps_first_class_mail',
      serviceName: 'USPS First Class Mail',
      shipmentCost: +(base * 0.71).toFixed(2),
      otherCost: 0,
      days: 5,
    },
    {
      carrierCode: 'stamps_com',
      serviceCode: 'usps_priority_mail',
      serviceName: 'USPS Priority Mail',
      shipmentCost: +(base * 1.0).toFixed(2),
      otherCost: 0,
      days: 3,
    },
    {
      carrierCode: 'stamps_com',
      serviceCode: 'usps_priority_mail_express',
      serviceName: 'USPS Priority Mail Express',
      shipmentCost: +(base * 2.35).toFixed(2),
      otherCost: 0,
      days: 1,
    },
    {
      carrierCode: 'ups',
      serviceCode: 'ups_ground',
      serviceName: 'UPS Ground',
      shipmentCost: +(base * 1.28).toFixed(2),
      otherCost: 0.85,
      days: 5,
    },
    {
      carrierCode: 'ups',
      serviceCode: 'ups_2nd_day_air',
      serviceName: 'UPS 2nd Day Air',
      shipmentCost: +(base * 2.75).toFixed(2),
      otherCost: 0.85,
      days: 2,
    },
    {
      carrierCode: 'fedex',
      serviceCode: 'fedex_ground',
      serviceName: 'FedEx Ground',
      shipmentCost: +(base * 1.22).toFixed(2),
      otherCost: 0.75,
      days: 5,
    },
  ]
}

function generateTracking(carrier) {
  const n = () => Math.floor(Math.random() * 1e10).toString().padStart(10, '0')
  if (carrier === 'stamps_com') return `9400111899223${n()}`
  if (carrier === 'ups') return `1Z999AA1${n()}`
  if (carrier === 'fedex') return `7749${n()}${n().slice(0, 2)}`
  return `TRACK${Date.now()}`
}

export function trackingUrl(carrier, tracking) {
  if (carrier === 'stamps_com') return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`
  if (carrier === 'ups') return `https://www.ups.com/track?tracknum=${tracking}`
  if (carrier === 'fedex') return `https://www.fedex.com/fedextrack/?tracknumbers=${tracking}`
  return '#'
}

export function carrierLabel(code) {
  if (code === 'stamps_com') return 'USPS'
  if (code === 'ups') return 'UPS'
  if (code === 'fedex') return 'FedEx'
  return code.toUpperCase()
}

export async function testConnection(key, secret) {
  try {
    const res = await fetch(`${SS_BASE}/carriers`, {
      headers: { 'Authorization': authHeader(key, secret), 'Content-Type': 'application/json' },
    })
    if (res.ok) return { ok: true }
    if (res.status === 401) return { ok: false, error: 'Invalid API credentials — check your key and secret.' }
    return { ok: false, error: `Server responded with ${res.status}` }
  } catch {
    return { ok: false, error: 'Cannot reach ShipStation from browser (CORS). Use a backend proxy in production.' }
  }
}

export async function getRates(key, secret, to, weightLbs) {
  const body = {
    carrierCode: null,
    fromPostalCode: '92802',
    toCountry: 'US',
    toPostalCode: to.zip,
    toState: to.state,
    weight: { value: weightLbs, units: 'pounds' },
    dimensions: { units: 'inches', length: 12, width: 10, height: 6 },
  }
  try {
    const res = await fetch(`${SS_BASE}/shipments/getrates`, {
      method: 'POST',
      headers: { 'Authorization': authHeader(key, secret), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) return res.json()
    throw new Error('non-ok')
  } catch {
    await new Promise((r) => setTimeout(r, 1100))
    return mockRates(to.state)
  }
}

export async function createLabel(key, secret, order, rate, weightLbs, shipFrom) {
  const addrParts = order.address.split(', ')
  const lastPart = addrParts[addrParts.length - 1] ?? ''
  const zip = lastPart.match(/(\d{5})/)?.[1] ?? '00000'
  const state = lastPart.match(/([A-Z]{2})/)?.[0] ?? 'CA'
  const city = addrParts[addrParts.length - 2] ?? ''
  const street = addrParts[0] ?? ''

  const body = {
    carrierCode: rate.carrierCode,
    serviceCode: rate.serviceCode,
    packageCode: 'package',
    shipDate: new Date().toISOString().split('T')[0],
    weight: { value: weightLbs, units: 'pounds' },
    dimensions: { units: 'inches', length: 12, width: 10, height: 6 },
    shipFrom: {
      name: shipFrom.name,
      street1: shipFrom.street1,
      city: shipFrom.city,
      state: shipFrom.state,
      postalCode: shipFrom.postalCode,
      country: 'US',
      phone: shipFrom.phone,
    },
    shipTo: {
      name: order.customer.name,
      street1: street,
      city,
      state,
      postalCode: zip,
      country: 'US',
    },
    testLabel: true,
  }

  try {
    const res = await fetch(`${SS_BASE}/shipments/createlabel`, {
      method: 'POST',
      headers: { 'Authorization': authHeader(key, secret), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const data = await res.json()
      return { ...data, cost: rate.shipmentCost + rate.otherCost }
    }
    throw new Error('non-ok')
  } catch {
    await new Promise((r) => setTimeout(r, 1500))
    return {
      shipmentId: Math.floor(Math.random() * 9_000_000) + 1_000_000,
      trackingNumber: generateTracking(rate.carrierCode),
      labelData: '',
      shipDate: new Date().toISOString().split('T')[0],
      serviceCode: rate.serviceCode,
      carrierCode: rate.carrierCode,
      cost: rate.shipmentCost + rate.otherCost,
    }
  }
}

export async function syncOrderToShipStation(key, secret, order) {
  const addrParts = order.address.split(', ')
  const lastPart = addrParts[addrParts.length - 1] ?? ''
  const zip = lastPart.match(/(\d{5})/)?.[1] ?? '00000'
  const state = lastPart.match(/([A-Z]{2})/)?.[0] ?? 'CA'
  const city = addrParts[addrParts.length - 2] ?? ''
  const street = addrParts[0] ?? ''

  const body = {
    orderNumber: order.id,
    orderDate: order.date,
    orderStatus: 'awaiting_shipment',
    billTo: { name: order.customer.name, street1: street, city, state, postalCode: zip, country: 'US' },
    shipTo: { name: order.customer.name, street1: street, city, state, postalCode: zip, country: 'US', phone: order.customer.phone },
    items: order.items.map((i) => ({
      sku: i.name.toLowerCase().replace(/\s+/g, '-'),
      name: i.name,
      quantity: i.qty,
      unitPrice: i.price,
    })),
    amountPaid: order.total,
    customerEmail: order.customer.email,
  }

  try {
    const res = await fetch(`${SS_BASE}/orders/createorder`, {
      method: 'POST',
      headers: { 'Authorization': authHeader(key, secret), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) return res.json()
    throw new Error('non-ok')
  } catch {
    await new Promise((r) => setTimeout(r, 800))
    return { orderId: Math.floor(Math.random() * 9_000_000) + 1_000_000 }
  }
}
