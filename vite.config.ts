import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import {defineConfig} from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function safeStoragePlugin() {
  return {
    name: 'safe-storage-injector',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      // Skip node_modules and the storage utility itself
      if (
        id.includes('node_modules') || 
        !/\.(tsx?|jsx?)$/.test(id) || 
        id.includes('storage.ts') ||
        id.includes('main.tsx')
      ) {
        return null;
      }

      const hasLocal = code.includes('localStorage');
      const hasSession = code.includes('sessionStorage');
      if (!hasLocal && !hasSession) {
        return null;
      }

      if (code.includes('/utils/storage') || code.includes('safeLocalStorage')) {
        return null;
      }

      const importStatement = `import { safeLocalStorage as localStorage, safeSessionStorage as sessionStorage } from '@/src/utils/storage';\n`;
      return {
        code: importStatement + code,
        map: null,
      };
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [safeStoragePlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('recharts') || id.includes('d3') || id.includes('victory')) {
                return 'charts';
              }
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'pdf';
              }
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              if (id.includes('firebase')) {
                return 'firebase';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
