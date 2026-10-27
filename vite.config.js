import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => ({
  plugins: [vue()],
  // В нативном приложении ресурсы загружаются из встроенной папки dist.
  base: command === 'build' ? (mode === 'mobile' ? './' : '/Prog2/') : '/',
  server: {
    host: '0.0.0.0',
    port: 5175,
    strictPort: true,
  },
}))
