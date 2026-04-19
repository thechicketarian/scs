import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // This keeps the filenames consistent so your Squarespace links never break
        entryFileNames: `assets/scs-bundle.js`,
        chunkFileNames: `assets/scs-bundle.js`,
        assetFileNames: `assets/scs-bundle.[ext]`
      }
    }
  }
})