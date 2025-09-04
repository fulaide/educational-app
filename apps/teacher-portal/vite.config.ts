import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	envDir: resolve(__dirname, '../../'), // Load env from root directory
	css: {
		preprocessorOptions: {
			css: {
				// Ensure theme variables are processed
			}
		}
	}
});
