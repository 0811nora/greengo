import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: import.meta.env.PROD ? '/greengo/' : '/',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['global-builtin', 'import', 'color-functions', 'mixed-decls'],
        logger: {
          warn: (message, options) => {
            // 如果警告訊息包含 "deprecation" 或來自你的 style 資料夾，就直接丟掉不顯示
            if (options.deprecation) return;
          },
        },
      },
    },
  },
})
