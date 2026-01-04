import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0', // Allow external connections
    strictPort: false,
    allowedHosts: [
      '075a3695c81a.ngrok-free.app',
      '.ngrok-free.app',
      '.ngrok.app',
      'localhost',
      '127.0.0.1'
    ],
    hmr: {
      clientPort: 3000
    }
  }
})

