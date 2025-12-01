import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Allow VITE_API_URL to point to a remote/local backend during dev too.
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_URL || 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      // strictPort true hará que Vite falle si el puerto está en uso
      strictPort: true,
      proxy: {
        // Proxy de desarrollo para evitar problemas de CORS con el backend
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
