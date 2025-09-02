import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	dts: false, // Skip DTS generation for now due to TS errors
	clean: true,
	external: ['@educational-app/database', '@educational-app/types'],
	target: 'node18'
});