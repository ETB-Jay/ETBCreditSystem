// eslint-disable-next-line import/no-unresolved
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'firebase-vendor': ['firebase'],
          'utils-vendor': ['clsx', 'tailwind-merge', 'jszip'],
          // Split our large firebase service into its own chunk
          'firebase-service': ['./src/firebase.ts'],
        },
      },
    },
    // Enable minification and tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'firebase'],
  },
})