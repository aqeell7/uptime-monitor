import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  envDir: '../', // Load .env from root directory as requested
  plugins: [
    react(),
    tailwindcss(),
  ],
})
