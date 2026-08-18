/**
 * Public app user — what the UI consumes (never includes credentials).
 *
 * @typedef {Object} User
 * @property {string} uid      Firebase Auth uid
 * @property {string} name     Display name
 * @property {string} email
 * @property {boolean} isAdmin Demo-parity admin heuristic (email-based).
 *                             Replace with Firestore role / custom claims in production.
 */

/**
 * Minimal public profile stored in Firestore `users/{uid}`.
 *
 * @typedef {Object} UserProfile
 * @property {string} uid
 * @property {string} name
 * @property {string} email
 * @property {boolean} isAdmin
 * @property {import('firebase/firestore').FieldValue|Date} createdAt
 */

export {}
