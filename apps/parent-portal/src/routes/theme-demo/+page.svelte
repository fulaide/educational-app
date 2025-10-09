<script lang="ts">
	import { onMount } from 'svelte';

	// Simple theme definitions for demo
	const themes = {
		parent: {
			name: 'parent',
			displayName: 'Parent Portal',
			description: 'Warm, family-oriented theme for parent portal',
			primaryColor: '#10b981'
		},
		student: {
			name: 'student',
			displayName: 'Student Portal',
			description: 'Bright, engaging theme for student portal',
			primaryColor: '#0ea5e9'
		},
		teacher: {
			name: 'teacher',
			displayName: 'Teacher Portal',
			description: 'Professional theme for teacher portal',
			primaryColor: '#64748b'
		},
		admin: {
			name: 'admin',
			displayName: 'Admin Dashboard',
			description: 'Clean, systematic theme for admin dashboard',
			primaryColor: '#6b7280'
		}
	};

	let currentTheme = $state('parent');

	function handleThemeChange(themeName: string) {
		currentTheme = themeName;
		// Apply theme class to body
		document.body.classList.remove(...Object.keys(themes).map(name => `theme-${name}`));
		document.body.classList.add(`theme-${themeName}`);
		
		// Debug: Log the current classes
		console.log('Applied theme class:', `theme-${themeName}`);
		console.log('Body classes:', document.body.className);
		
		// Force a repaint by temporarily changing a CSS property
		document.body.style.transform = 'translateZ(0)';
		setTimeout(() => {
			document.body.style.transform = '';
		}, 1);
	}

	onMount(() => {
		// Initialize with parent theme
		handleThemeChange('parent');
	});
</script>

<svelte:head>
	<title>Theme System Demo - Educational App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-4">
				Educational App Theme System
			</h1>
			<p class="text-xl text-gray-600 mb-6">
				A comprehensive design token-based theme system supporting multiple user roles
			</p>
			
			<!-- Theme Switcher -->
			<div class="flex justify-center mb-8">
				<div class="bg-white p-4 rounded-lg shadow-sm border">
					<h3 class="text-sm font-medium text-gray-700 mb-3">Switch Theme:</h3>
					<div class="mb-3 text-xs text-gray-500">
						Current: theme-{currentTheme}
					</div>
					<div class="flex gap-3">
						{#each Object.entries(themes) as [key, theme]}
							<button
								type="button"
								class="flex items-center gap-2 px-4 py-2 rounded-md border transition-colors {currentTheme === key ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}"
								onclick={() => handleThemeChange(key)}
							>
								<div 
									class="w-4 h-4 rounded-full border-2 border-white shadow-sm"
									style="background-color: {theme.primaryColor}"
								></div>
								{theme.displayName}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Demo Sections -->
		<div class="space-y-8">
			<!-- Current Theme Info -->
			<div class="bg-white rounded-lg shadow-sm border p-6">
				<h2 class="text-2xl font-bold mb-4">
					Current Theme: {themes[currentTheme].displayName}
				</h2>
				<p class="text-gray-600 mb-4">
					{themes[currentTheme].description}
				</p>
				<div class="flex items-center gap-2">
					<span class="text-sm font-medium text-gray-700">Primary Color:</span>
					<div 
						class="w-6 h-6 rounded-full border border-gray-300"
						style="background-color: {themes[currentTheme].primaryColor}"
					></div>
					<code class="text-sm bg-gray-100 px-2 py-1 rounded">
						{themes[currentTheme].primaryColor}
					</code>
				</div>
			</div>

			<!-- Button Variants -->
			<div class="bg-white rounded-lg shadow-sm border p-6">
				<h2 class="text-xl font-semibold mb-4">Button Components</h2>
				<div class="space-y-4">
					<!-- Sample Buttons -->
					<div class="flex flex-wrap gap-3">
						<button class="theme-demo-button btn-primary px-4 py-2 rounded-md">
							Primary Button
						</button>
						<button class="theme-demo-button btn-secondary px-4 py-2 rounded-md">
							Secondary Button
						</button>
						<button class="theme-demo-button btn-accent px-4 py-2 rounded-md">
							Accent Button
						</button>
					</div>
					
					<!-- Different Sizes -->
					<div class="flex flex-wrap gap-3 items-center">
						<button class="theme-demo-button btn-primary px-2 py-1 text-sm rounded">
							Small
						</button>
						<button class="theme-demo-button btn-primary px-4 py-2 rounded-md">
							Medium
						</button>
						<button class="theme-demo-button btn-primary px-6 py-3 text-lg rounded-lg">
							Large
						</button>
					</div>
				</div>
			</div>

			<!-- Cards and Layout -->
			<div class="grid md:grid-cols-2 gap-6">
				<div class="bg-white rounded-lg shadow-sm border p-6">
					<h3 class="text-lg font-semibold mb-3">Theme Features</h3>
					<ul class="space-y-2 text-sm text-gray-600">
						<li>✅ Design token architecture</li>
						<li>✅ Consistent color palette</li>
						<li>✅ Typography system</li>
						<li>✅ Spacing scales</li>
						<li>✅ Component variants</li>
						<li>✅ Responsive design</li>
					</ul>
				</div>

				<div class="bg-white rounded-lg shadow-sm border p-6">
					<h3 class="text-lg font-semibold mb-3">Available Themes</h3>
					<div class="space-y-2">
						{#each Object.entries(themes) as [key, theme]}
							<div class="flex items-center gap-3 p-2 rounded {currentTheme === key ? 'bg-blue-50' : ''}">
								<div 
									class="w-3 h-3 rounded-full"
									style="background-color: {theme.primaryColor}"
								></div>
								<div>
									<div class="font-medium text-sm">{theme.displayName}</div>
									<div class="text-xs text-gray-500">{theme.description}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Usage Example -->
			<div class="bg-white rounded-lg shadow-sm border p-6">
				<h2 class="text-xl font-semibold mb-4">Usage Example</h2>
				<div class="bg-gray-50 p-4 rounded-md">
					<pre class="text-sm text-gray-800"><code>{`// Import themes and utilities
import { applyThemeClass, THEMES } from '@educational-app/ui';

// Apply theme programmatically
applyThemeClass('${currentTheme}');

// Theme information
const currentTheme = THEMES['${currentTheme}'];
console.log(currentTheme.displayName); // "${themes[currentTheme].displayName}"
console.log(currentTheme.primaryColor); // "${themes[currentTheme].primaryColor}"`}</code></pre>
				</div>
			</div>

			<!-- CSS Variables Preview -->
			<div class="bg-white rounded-lg shadow-sm border p-6">
				<h2 class="text-xl font-semibold mb-4">CSS Design Tokens</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<!-- Colors -->
					<div>
						<h4 class="font-medium mb-2">Colors</h4>
						<div class="space-y-1 text-sm">
							<div class="flex items-center gap-2">
								<div class="w-4 h-4 color-swatch-primary rounded"></div>
								<code>--color-primary-500</code>
							</div>
							<div class="flex items-center gap-2">
								<div class="w-4 h-4 color-swatch-secondary rounded"></div>
								<code>--color-secondary-500</code>
							</div>
							<div class="flex items-center gap-2">
								<div class="w-4 h-4 color-swatch-accent rounded"></div>
								<code>--color-accent-500</code>
							</div>
						</div>
					</div>

					<!-- Typography -->
					<div>
						<h4 class="font-medium mb-2">Typography</h4>
						<div class="space-y-1 text-sm">
							<div><code>--font-family-sans</code></div>
							<div><code>--font-size-base</code></div>
							<div><code>--font-weight-medium</code></div>
							<div><code>--line-height-normal</code></div>
						</div>
					</div>

					<!-- Spacing -->
					<div>
						<h4 class="font-medium mb-2">Spacing</h4>
						<div class="space-y-1 text-sm">
							<div class="flex items-center gap-2">
								<div class="w-4 h-1 bg-gray-400"></div>
								<code>--space-4 (1rem)</code>
							</div>
							<div class="flex items-center gap-2">
								<div class="w-6 h-1 bg-gray-400"></div>
								<code>--space-6 (1.5rem)</code>
							</div>
							<div class="flex items-center gap-2">
								<div class="w-8 h-1 bg-gray-400"></div>
								<code>--space-8 (2rem)</code>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="text-center mt-12 pt-8 border-t">
			<p class="text-gray-500 text-sm">
				Educational App Platform Theme System - Built with SvelteKit and CSS Design Tokens
			</p>
		</div>
	</div>
</div>

<style>
	/* Base theme styles for demo */
	:root {
		--color-primary-500: #10b981;
		--color-primary-600: #059669;
		--color-secondary-500: #6b7280;
		--color-secondary-600: #4b5563;
		--color-accent-500: #f59e0b;
		--color-accent-600: #d97706;
	}

	/* Student theme */
	:global(body.theme-student) {
		--color-primary-500: #0ea5e9;
		--color-primary-600: #0284c7;
		--color-secondary-500: #22c55e;
		--color-secondary-600: #16a34a;
		--color-accent-500: #f97316;
		--color-accent-600: #ea580c;
	}

	/* Teacher theme */
	:global(body.theme-teacher) {
		--color-primary-500: #64748b;
		--color-primary-600: #475569;
		--color-secondary-500: #d946ef;
		--color-secondary-600: #c026d3;
		--color-accent-500: #f59e0b;
		--color-accent-600: #d97706;
	}

	/* Admin theme */
	:global(body.theme-admin) {
		--color-primary-500: #6b7280;
		--color-primary-600: #4b5563;
		--color-secondary-500: #10b981;
		--color-secondary-600: #059669;
		--color-accent-500: #ef4444;
		--color-accent-600: #dc2626;
	}

	/* Parent theme (default) */
	:global(body.theme-parent) {
		--color-primary-500: #10b981;
		--color-primary-600: #059669;
		--color-secondary-500: #6b7280;
		--color-secondary-600: #4b5563;
		--color-accent-500: #f59e0b;
		--color-accent-600: #d97706;
	}

	/* Theme-aware button styles */
	.theme-demo-button {
		color: white !important;
		border: none;
		cursor: pointer;
		transition: all 0.15s ease-in-out;
		font-weight: 500;
	}

	.theme-demo-button.btn-primary {
		background-color: var(--color-primary-500, #10b981);
	}

	.theme-demo-button.btn-primary:hover {
		background-color: var(--color-primary-600, #059669);
	}

	.theme-demo-button.btn-secondary {
		background-color: var(--color-secondary-500, #6b7280);
	}

	.theme-demo-button.btn-secondary:hover {
		background-color: var(--color-secondary-600, #4b5563);
	}

	.theme-demo-button.btn-accent {
		background-color: var(--color-accent-500, #f59e0b);
	}

	.theme-demo-button.btn-accent:hover {
		background-color: var(--color-accent-600, #d97706);
	}

	/* Color swatches that respond to theme changes */
	.color-swatch-primary {
		background-color: var(--color-primary-500, #10b981);
	}

	.color-swatch-secondary {
		background-color: var(--color-secondary-500, #6b7280);
	}

	.color-swatch-accent {
		background-color: var(--color-accent-500, #f59e0b);
	}
</style>