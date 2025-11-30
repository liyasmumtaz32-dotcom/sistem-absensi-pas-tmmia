import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: './' sangat penting agar asset dimuat dengan benar di GitHub Pages (subfolder)
  base: './',
});