import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAaa8EmSN3ns2p-a7C7gax4O7U4r3_f6QM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mechheaven-5575c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mechheaven-5575c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mechheaven-5575c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "822480815829",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:822480815829:web:1ed6576c62c6212b2ac45c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SBCCNWQ40P"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
export default app
