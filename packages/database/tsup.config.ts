import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Skip DTS generation for now due to TS errors
  clean: true,
  external: ['@prisma/client']
});