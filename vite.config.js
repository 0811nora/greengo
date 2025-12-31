import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // 這裡改用 command === 'build' 來判斷
    base: command === 'build' ? '/greengo/' : '/',
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['global-builtin', 'import', 'color-functions', 'mixed-decls'],
          logger: {
            warn: (message, options) => {
              if (options.deprecation) return;
            },
          },
        },
      },
    },
  }
})
