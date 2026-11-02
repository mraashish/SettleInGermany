import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The CMS reads the shared content types and seed from the app (../src/content).
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'EXPO_PUBLIC_'],
  envDir: '..',
  server: { port: 5174, fs: { allow: ['..'] } },
  test: { environment: 'node' },
});
