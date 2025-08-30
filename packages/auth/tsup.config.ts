import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		server: 'src/server/index.ts',
		client: 'src/client/index.ts'
	},
	format: ['esm'],
	dts: true,
	clean: true,
	external: ['@educational-app/database', '@educational-app/types'],
	target: 'node18'
});