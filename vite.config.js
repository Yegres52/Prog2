import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  // Локально сайт открыт в /, на GitHub Pages — в /Prog2/.
  base: command === 'build' ? '/Prog2/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5175,
    strictPort: true,
  },
}))
