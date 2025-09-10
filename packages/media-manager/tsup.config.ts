import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false, // Disable DTS generation for now due to Svelte components
  sourcemap: true,
  clean: true,
  external: ['svelte', 'svelte/store', '@vercel/blob', 'zod']
})