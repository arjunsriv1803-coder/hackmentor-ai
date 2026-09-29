import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During development (npm run dev) the page is served by Vite on port 5173,
// but the AI calls still have to go to our own small server on port 3000,
// because that is where the secret API key lives. This proxy forwards them.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist'
  }
});
