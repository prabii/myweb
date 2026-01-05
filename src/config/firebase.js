import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA8iiAM4HBOcD0q80K3OZcG5OhWrX0X5nE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mechheaven-c9097.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mechheaven-c9097",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mechheaven-c9097.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "300965549156",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:300965549156:web:af07f2f914a7481d21fb71",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5FS03MVL3M"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
export default app
