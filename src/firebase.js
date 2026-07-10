import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCrjRkQtaG79UegWVRNVUezEWXe23TsBv8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lolly-shop.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lolly-shop",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lolly-shop.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "104808906302",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:104808906302:web:dc5100f42c9acb4e689b6f"
};

const hasKeys = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "AIzaSyDummyKeyPlaceholderForCompileOnly";

let authInstance = null;
let providerInstance = null;

try {
  const app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  providerInstance = new GoogleAuthProvider();
} catch (error) {
  console.warn("Firebase initialization warning (Google Auth disabled until keys are added):", error);
}

export const auth = authInstance;
export const googleProvider = providerInstance;
export const firebaseEnabled = hasKeys;
