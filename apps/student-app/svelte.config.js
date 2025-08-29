import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// Use static adapter for Capacitor mobile deployment
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		
		// Path aliases for better imports
		alias: {
			'@/*': './src/*',
			'$components': './src/lib/components',
			'$stores': './src/lib/stores',
			'$utils': './src/lib/utils',
			'$types': './src/lib/types'
		},

		// Service worker for offline functionality
		serviceWorker: {
			register: true
		}
	}
};

export default config;
