import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebaseConfig';

export async function uploadComponentImage(file: File, path: string = 'images'): Promise<string> {
  if (isFirebaseConfigured) {
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (e) {
      console.warn('Firebase Storage upload failed, fallback to base64 Data URL:', e);
    }
  }

  // Graceful fallback to FileReader Base64 for instant local preview
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}
