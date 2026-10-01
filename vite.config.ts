/// <reference types="vitest/config" />
import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  // HOST and PORT come from the root .env (template in setup/env.template)
  const env = loadEnv(mode, process.cwd(), '');
  const server = {
    host: env.HOST || '127.0.0.1',
    port: Number(env.PORT) || 8080,
    strictPort: true
  };

  return {
    plugins: [react()],
    // Expose MAPS_* from .env to the client as import.meta.env.MAPS_*
    envPrefix: ['VITE_', 'MAPS_'],
    server,
    preview: server,
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts']
    }
  };
});
