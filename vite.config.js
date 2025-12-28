import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
    allowedHosts: [
      '075a3695c81a.ngrok-free.app',
      '.ngrok-free.app',
      '.ngrok.app',
      'localhost'
    ]
  }
})

