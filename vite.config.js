// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     rollupOptions: {
//       output: {
//         // This keeps the filenames consistent so your Squarespace links never break
//         entryFileNames: `assets/scs-bundle.js`,
//         chunkFileNames: `assets/scs-bundle.js`,
//         assetFileNames: `assets/scs-bundle.[ext]`
//       }
//     }
//   }
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        format: 'iife', // This is the magic fix for injection
        name: 'SCS_App',
        entryFileNames: `assets/scs-bundle.js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/scs-bundle.[ext]`,
      }
    }
  }
})