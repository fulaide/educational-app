import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	
	test: {
		// Test environment
		environment: 'jsdom',
		
		// Include patterns
		include: [
			'apps/**/*.{test,spec}.{js,ts}',
			'packages/**/*.{test,spec}.{js,ts}'
		],
		
		// Exclude patterns
		exclude: [
			'**/node_modules/**',
			'**/dist/**',
			'**/build/**',
			'**/.svelte-kit/**',
			'**/ios/**',
			'**/android/**'
		],
		
		// Setup files
		setupFiles: ['./vitest.setup.ts'],
		
		// Coverage configuration
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'**/node_modules/**',
				'**/dist/**',
				'**/build/**',
				'**/.svelte-kit/**',
				'**/coverage/**',
				'**/*.config.*',
				'**/*.setup.*',
				'**/ios/**',
				'**/android/**',
				'**/*.stories.*',
				'**/*.d.ts'
			],
			thresholds: {
				global: {
					branches: 70,
					functions: 70,
					lines: 70,
					statements: 70
				}
			}
		},
		
		// Globals
		globals: true,
		
		// Watch options
		watch: {
			exclude: [
				'**/node_modules/**',
				'**/dist/**',
				'**/build/**',
				'**/.svelte-kit/**'
			]
		},
		
		// Reporters
		reporter: ['verbose', 'html'],
		
		// Timeout
		testTimeout: 10000,
		hookTimeout: 10000
	}
});