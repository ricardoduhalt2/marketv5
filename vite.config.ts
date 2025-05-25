/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  css: {
    devSourcemap: true,
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          thirdweb: ['thirdweb', '@thirdweb-dev/react', '@thirdweb-dev/sdk'],
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
});
