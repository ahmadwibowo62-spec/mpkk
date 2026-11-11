import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Configuration from environment variables or fallback for local studio preview
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemo-TKRO-Preview-Key-9999',
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || 'speed-battle-tkro.firebaseapp.com',
  projectId: import.meta.env.VITE_PROJECT_ID || 'speed-battle-tkro',
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || 'speed-battle-tkro.appspot.com',
  messagingSenderId: import.meta.env.VITE_MESSAGING_ID || '123456789012',
  appId: import.meta.env.VITE_APP_ID || '1:123456789012:web:abcdef123456',
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY
);

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

export { firebaseConfig };
export default app;
