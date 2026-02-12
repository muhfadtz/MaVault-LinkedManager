import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// Create or update user profile doc in Firestore
const ensureUserProfile = async (firebaseUser: User) => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || 'User',
      photoURL: firebaseUser.photoURL,
      createdAt: Date.now(),
    });
  }
};

const mapFirebaseUser = (firebaseUser: User): UserProfile => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser));
        ensureUserProfile(firebaseUser).catch(console.error);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  }, []);

  const signUp = useCallback(async (email: string, pass: string, displayName?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error('Not authenticated');

    // Re-authenticate first
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  }, []);

  const updateDisplayName = useCallback(async (name: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not authenticated');

    await updateProfile(currentUser, { displayName: name });
    // Update Firestore too
    await updateDoc(doc(db, 'users', currentUser.uid), { displayName: name });
    // Update local state
    setUser(prev => prev ? { ...prev, displayName: name } : null);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, resetPassword, changePassword, updateDisplayName, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
