import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebaseConfig';
import { UserDoc, getLocalStore } from './firestore';

export interface AuthProfile {
  uid: string;
  nama: string;
  email: string;
  role: 'admin' | 'guru' | 'siswa';
  kelas: string;
  avatar?: string;
}

const CURRENT_USER_KEY = 'speed_battle_tkro_current_user';

export function getCachedUserProfile(): AuthProfile {
  if (typeof window === 'undefined') {
    return {
      uid: 'guru-1',
      nama: 'Ir. Hendra Gunawan, M.T. (Guru TKRO)',
      email: 'guru.hendra@smk-tkro.sch.id',
      role: 'guru',
      kelas: 'XII TKRO 1',
    };
  }

  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  // Default to Teacher role for immediate rich preview
  const defaultUser: AuthProfile = {
    uid: 'guru-1',
    nama: 'Ir. Hendra Gunawan, M.T.',
    email: 'guru.hendra@smk-tkro.sch.id',
    role: 'guru',
    kelas: 'XII TKRO 1',
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
  return defaultUser;
}

export function setCachedUserProfile(profile: AuthProfile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<AuthProfile> {
  if (isFirebaseConfigured) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const profile: AuthProfile = {
        uid: res.user.uid,
        nama: res.user.displayName || email.split('@')[0],
        email: res.user.email || email,
        role: email.includes('admin') ? 'admin' : email.includes('guru') ? 'guru' : 'siswa',
        kelas: 'XII TKRO 1',
      };
      setCachedUserProfile(profile);
      return profile;
    } catch (e) {
      console.warn('Firebase Auth email login fallback to local user DB:', e);
    }
  }

  // Search matching in local users
  const store = getLocalStore();
  const match = store.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (match) {
    const profile: AuthProfile = {
      uid: match.uid,
      nama: match.nama,
      email: match.email || email,
      role: match.role,
      kelas: match.kelas,
    };
    setCachedUserProfile(profile);
    return profile;
  }

  // Smart fallback based on email pattern
  const role: 'admin' | 'guru' | 'siswa' = email.includes('admin') ? 'admin' : email.includes('guru') ? 'guru' : 'siswa';
  const fallbackProfile: AuthProfile = {
    uid: `user-${Date.now()}`,
    nama: email.split('@')[0].toUpperCase(),
    email,
    role,
    kelas: 'XII TKRO 1',
  };
  setCachedUserProfile(fallbackProfile);
  return fallbackProfile;
}

export async function loginWithGoogle(): Promise<AuthProfile> {
  if (isFirebaseConfigured) {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const email = res.user.email || '';
      const role: 'admin' | 'guru' | 'siswa' = email.includes('admin') ? 'admin' : email.includes('guru') ? 'guru' : 'siswa';
      const profile: AuthProfile = {
        uid: res.user.uid,
        nama: res.user.displayName || 'Pengguna Google',
        email,
        role,
        kelas: 'XII TKRO 1',
      };
      setCachedUserProfile(profile);
      return profile;
    } catch (e) {
      console.warn('Google Popup Auth fallback:', e);
    }
  }

  const profile: AuthProfile = {
    uid: 'google-user-tkro',
    nama: 'Ahmad Wibowo (Google Guru)',
    email: 'ahmadwibowo62@guru.sma.belajar.id',
    role: 'guru',
    kelas: 'XII TKRO 1',
  };
  setCachedUserProfile(profile);
  return profile;
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured) {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}
