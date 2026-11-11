import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/firebaseConfig';
import {
  AuthProfile,
  getCachedUserProfile,
  setCachedUserProfile,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
} from '../firebase/auth';

interface AuthContextType {
  user: AuthProfile | null;
  loading: boolean;
  switchRole: (role: 'admin' | 'guru' | 'siswa') => void;
  loginEmail: (email: string, pass: string) => Promise<AuthProfile>;
  loginGoogle: () => Promise<AuthProfile>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<AuthProfile>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  switchRole: () => {},
  loginEmail: async () => ({ uid: '', nama: '', email: '', role: 'siswa', kelas: '' }),
  loginGoogle: async () => ({ uid: '', nama: '', email: '', role: 'siswa', kelas: '' }),
  logout: async () => {},
  updateProfile: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthProfile | null>(() => getCachedUserProfile());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isFirebaseConfigured) {
      try {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
          if (firebaseUser) {
            const role = firebaseUser.email?.includes('admin')
              ? 'admin'
              : firebaseUser.email?.includes('guru')
              ? 'guru'
              : 'siswa';
            const updated: AuthProfile = {
              uid: firebaseUser.uid,
              nama: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User TKRO',
              email: firebaseUser.email || '',
              role,
              kelas: 'XII TKRO 1',
            };
            setUser(updated);
            setCachedUserProfile(updated);
          }
        });
        return () => unsubscribe();
      } catch (err) {
        console.warn('Firebase Auth listener error:', err);
      }
    }
  }, []);

  const switchRole = (role: 'admin' | 'guru' | 'siswa') => {
    let nama = 'Siswa TKRO (Rizki)';
    let email = 'rizki@siswa.smk.id';
    if (role === 'admin') {
      nama = 'Bambang Sudarsono, S.Pd (Admin)';
      email = 'admin@smk-tkro.sch.id';
    } else if (role === 'guru') {
      nama = 'Ir. Hendra Gunawan, M.T. (Guru Mesin)';
      email = 'guru.hendra@smk-tkro.sch.id';
    }
    const updated: AuthProfile = {
      uid: `${role}-1`,
      nama,
      email,
      role,
      kelas: 'XII TKRO 1',
    };
    setUser(updated);
    setCachedUserProfile(updated);
  };

  const loginEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const profile = await loginWithEmail(email, pass);
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const profile = await loginWithGoogle();
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const updateProfile = (partial: Partial<AuthProfile>) => {
    if (user) {
      const updated = { ...user, ...partial };
      setUser(updated);
      setCachedUserProfile(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        switchRole,
        loginEmail,
        loginGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
export default AuthProvider;
