import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const hasKeys = !!import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyPlaceholderForCompileOnly",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lolly-shop.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lolly-shop",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lolly-shop.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

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
