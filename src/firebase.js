import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAT7_Hqa4ZC9wHMtCwbHnLJ-p2f7NP9XXI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "techcore-715e7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "techcore-715e7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "techcore-715e7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "453915635132",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:453915635132:web:23e406cbf25318b6400fb9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9HT0ZC0Q62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics safely for browser environment
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics initialization notice:", err);
  });
}

// Export initialized services for easy access across the app
export const auth = getAuth(app);
export const db = getFirestore(app);

export { app, analytics };
export default app;
