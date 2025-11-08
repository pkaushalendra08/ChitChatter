import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // This forwards all requests starting with /api
      // to your backend server
      '/api': {
        target: 'http://localhost:5000', // 👈 Change 5000 to your backend's port
        changeOrigin: true,
      }
    }
  }
})
