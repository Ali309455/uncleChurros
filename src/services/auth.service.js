// AuthService — all Firebase Authentication access goes through this class.
// Components must never import `getAuth` / call Firebase Auth APIs directly.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

/**
 * Demo-parity admin heuristic (email contains "admin"/"walt"), mirroring the
 * existing LoginForm behavior. In production, replace with Firestore role
 * documents or Auth custom claims — see firestore.rules.
 */
function isAdminEmail(email) {
  const e = String(email || '').toLowerCase()
  return e.includes('admin') || e.includes('walt')
}

/** Map Firebase Auth error codes to safe, user-facing messages. */
function toFriendlyError(error) {
  const code = error?.code || ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in.'
    case 'auth/invalid-email':
      return 'Enter a valid email address.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.'
    default:
      return 'Authentication failed. Please try again.'
  }
}

/** Convert a FirebaseAuthUser to the public app user shape. */
function toUser(firebaseUser) {
  if (!firebaseUser) return null
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
    email: firebaseUser.email || '',
    isAdmin: isAdminEmail(firebaseUser.email),
  }
}

export class AuthService {
  /** Register with email/password, then write a minimal public profile doc. */
  async register({ name, email, password }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      if (name) await updateProfile(firebaseUser, { displayName: name })

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        name,
        email,
        isAdmin: isAdminEmail(email),
        createdAt: serverTimestamp(),
      })

      return toUser(firebaseUser)
    } catch (error) {
      throw new Error(toFriendlyError(error))
    }
  }

  /** Sign in with email/password. */
  async login({ email, password }) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return toUser(userCredential.user)
    } catch (error) {
      throw new Error(toFriendlyError(error))
    }
  }

  /** Sign in with a Google popup. */
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      return toUser(userCredential.user)
    } catch (error) {
      throw new Error(toFriendlyError(error))
    }
  }

  /** Sign the current user out. */
  async logout() {
    await signOut(auth)
  }

  /** The current Firebase user, or null. */
  getCurrentUser() {
    return toUser(auth.currentUser)
  }

  /** Subscribe to auth state changes. Returns an unsubscribe function. */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, (firebaseUser) => callback(toUser(firebaseUser)))
  }

  /** Current user's uid, or null when signed out. */
  getCurrentUserId() {
    return auth.currentUser?.uid ?? null
  }

  /** True when a user is signed in. */
  isAuthenticated() {
    return !!auth.currentUser
  }
}

/** Singleton — import this everywhere. */
export const authService = new AuthService()
