import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 400,
    esbuild: {
      drop: ['console', 'debugger']
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-helmet-async')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/@dnd-kit')) {
            return 'dnd-vendor'
          }
          if (id.includes('node_modules/react-player')) {
            return 'player-vendor'
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap-vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor'
          }
          return undefined
        }
      }
    }
  }
})
