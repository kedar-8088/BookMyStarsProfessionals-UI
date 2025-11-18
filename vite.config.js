import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    proxy: {
      '/bookmystarsprofessionals': {
        target: 'https://wsproductspostgre.cloudjiffy.net',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
