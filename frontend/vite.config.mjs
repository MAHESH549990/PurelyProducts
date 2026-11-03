import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/app/',
  plugins: [react()],
  root: 'frontend',
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
      '/users': 'http://localhost:8080',
      '/product': 'http://localhost:8080',
      '/orders': 'http://localhost:8080',
      '/admin': 'http://localhost:8080',
      '/delivery': 'http://localhost:8080'
    }
  },
  build: { outDir: '../public/app', emptyOutDir: true }
});
