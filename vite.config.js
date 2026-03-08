import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // all dependencies in a separate chunk
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000, // allow 2MB chunk size
  },
});