import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/OB-ERP/',  // matches your GitHub repo name exactly
})
