import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Path to service account JSON file
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
  join(__dirname, '..', 'config', 'mechheaven-c9097-firebase-adminsdk-fbsvc-f93f8c772c.json')

let serviceAccount

try {
  // Try to read from environment variable (for production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  } else {
    // Read from file
    const serviceAccountFile = readFileSync(serviceAccountPath, 'utf8')
    serviceAccount = JSON.parse(serviceAccountFile)
  }
} catch (error) {
  console.error('Error loading Firebase service account:', error.message)
  console.error('Make sure FIREBASE_SERVICE_ACCOUNT_PATH is set or service account file exists')
}

// Initialize Firebase Admin SDK
if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    console.log('Firebase Admin SDK initialized successfully')
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error.message)
  }
} else {
  console.warn('Firebase Admin SDK not initialized - service account not found')
}

export default admin
