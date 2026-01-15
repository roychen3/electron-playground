import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const isLibMode = process.env.LIB === 'true';

const libConfig: UserConfig = {
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.app.json',
    }),
  ],
  build: {
    outDir: 'dist-lib',
    lib: {
      entry: resolve(__dirname, 'src/lib-export.tsx'),
      name: 'WebUI',
      fileName: 'web-ui',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
};

const webConfig: UserConfig = {
  plugins: [react()],
};

// https://vite.dev/config/
export default defineConfig(isLibMode ? libConfig : webConfig);
