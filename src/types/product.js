/**
 * Product schema — mirrors the existing catalogue in `src/data/products.js`
 * plus the admin "Add product" form.
 *
 * @typedef {Object} Product
 * @property {string} id            Firestore document id
 * @property {string} name          Display name (e.g. "Classic Cinnamon Churros")
 * @property {string} category      'churros' | 'beignets' | 'chimichangas'
 * @property {number|null} price    Regular price per dozen (null when coming soon)
 * @property {number|null} price6plus Bulk price per dozen for 6+ dozens
 * @property {number|null} parkPrice   Comparison price shown to shoppers
 * @property {string} weight        Pack size label (e.g. "1 Dozen (12 pieces)")
 * @property {string} description   Short marketing description
 * @property {string} image         Image URL
 * @property {boolean} featured     Shown in hero grid
 * @property {boolean} available    false = "Coming soon"
 * @property {number} rating        Average rating (0–5)
 * @property {number} reviewCount   Number of reviews
 * @property {number|null} stock    Units in stock; null = stock not tracked
 * @property {import('firebase/firestore').FieldValue|Date} createdAt
 * @property {import('firebase/firestore').FieldValue|Date} updatedAt
 */

/**
 * Data a product can be created/updated with (no id, no timestamps).
 *
 * @typedef {Omit<Product, 'id'|'createdAt'|'updatedAt'>} ProductInput
 */

export {}
