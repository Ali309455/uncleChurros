// Frontend-only shipping simulation — no backend, no network calls.
// Rates, labels, and provider syncs are generated locally so the admin
// dashboard stays fully functional in a decoupled (client-only) build.

const simulate = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Carrier display label. */
export function carrierLabel(code) {
  if (code === 'stamps_com') return 'USPS'
  if (code === 'ups') return 'UPS'
  if (code === 'fedex') return 'FedEx'
  return String(code || '').toUpperCase()
}

/** Public tracking URL for a carrier + tracking number, or '#' when unknown. */
export function trackingUrl(carrier, tracking) {
  if (carrier === 'stamps_com') return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`
  if (carrier === 'ups') return `https://www.ups.com/track?tracknum=${tracking}`
  if (carrier === 'fedex') return `https://www.fedex.com/fedextrack/?tracknumbers=${tracking}`
  return '#'
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

/** Simulated shipping rates for a destination + weight. */
export async function getShippingRates({ state, zip }, weightLbs) {
  await simulate(900)
  return mockRates(state)
}

/** Simulated label creation. Returns a ShipStation-shaped label object. */
export async function createShippingLabel(order, rate, weightLbs, shipFrom) {
  await simulate(1200)
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

/** Simulated sync of an order to the shipping provider. */
export async function syncToShippingProvider(order) {
  await simulate(800)
  return { orderId: Math.floor(Math.random() * 9_000_000) + 1_000_000 }
}