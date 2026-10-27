import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// TW1 — Tailwind CSS v4 is wired in through its official Vite plugin.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
