import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Simple hash for PIN (not cryptographically secure, but sufficient for a client-side vault lock)
const hashPin = (pin: string): string => {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'pin_' + Math.abs(hash).toString(36);
};

/**
 * Check if user has a PIN set
 */
export const hasPin = async (userId: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, 'users', userId));
  return !!(snap.exists() && snap.data()?.vaultPin);
};

/**
 * Create or update the user's vault PIN
 */
export const setPin = async (userId: string, pin: string): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    vaultPin: hashPin(pin),
  });
};

/**
 * Verify entered PIN against stored hash
 */
export const verifyPin = async (userId: string, pin: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return false;
  return snap.data()?.vaultPin === hashPin(pin);
};

/**
 * Remove PIN (used during Forgot PIN reset)
 */
export const removePin = async (userId: string): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    vaultPin: null,
  });
};
