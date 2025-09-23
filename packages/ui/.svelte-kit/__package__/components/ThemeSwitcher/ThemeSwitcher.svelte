<script lang="ts">
	import { createThemeStore, THEMES, type ThemeName } from '../../utils/theme-manager.js';
	import { onMount } from 'svelte';

	interface Props {
		/** CSS class for styling */
		class?: string;
		/** Show theme names or just colors */
		showNames?: boolean;
		/** Size variant */
		size?: 'sm' | 'md' | 'lg';
		/** Default theme to initialize with */
		defaultTheme?: ThemeName;
	}

	let { 
		class: className = '', 
		showNames = true,
		size = 'md',
		defaultTheme = 'parent'
	}: Props = $props();

	const themeStore = createThemeStore();
	let isLoading = $state(false);

	onMount(() => {
		themeStore.initialize(defaultTheme);
	});

	async function handleThemeChange(themeName: ThemeName) {
		if (themeName === themeStore.theme) return;
		
		isLoading = true;
		try {
			await themeStore.switchTo(themeName);
		} catch (error) {
			console.error('Failed to switch theme:', error);
		} finally {
			isLoading = false;
		}
	}

	const sizeClasses = {
		sm: 'text-sm gap-2 p-2',
		md: 'text-base gap-3 p-3', 
		lg: 'text-lg gap-4 p-4'
	};
</script>

<div class="theme-switcher {className} {sizeClasses[size]}">
	<div class="theme-options flex flex-wrap gap-2">
		{#each Object.values(THEMES) as theme}
			<button
				type="button"
				class="theme-option"
				class:active={themeStore.theme === theme.name}
				disabled={isLoading}
				onclick={() => handleThemeChange(theme.name)}
				title={theme.description}
			>
				<div 
					class="color-indicator"
					style="background-color: {theme.primaryColor}"
				></div>
				{#if showNames}
					<span class="theme-name">{theme.displayName}</span>
				{/if}
			</button>
		{/each}
	</div>
	
	{#if isLoading}
		<div class="loading-indicator">
			<div class="spinner"></div>
			<span class="sr-only">Switching theme...</span>
		</div>
	{/if}
</div>

<style>
	.theme-switcher {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.theme-options {
		display: flex;
		background: white;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		padding: 0.25rem;
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
	}

	.theme-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: none;
		background: transparent;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 150ms ease-in-out;
		color: #6b7280;
		font-weight: 500;
		font-size: 0.875rem;
	}

	.theme-option:hover {
		background: #f3f4f6;
		color: #374151;
	}

	.theme-option.active {
		background: #f3f4f6;
		color: #111827;
		font-weight: 600;
	}

	.theme-option:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.color-indicator {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		border: 2px solid white;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.1);
		flex-shrink: 0;
	}

	.theme-name {
		white-space: nowrap;
	}

	.loading-indicator {
		position: absolute;
		top: 50%;
		right: -2.5rem;
		transform: translateY(-50%);
	}

	.spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid #e5e7eb;
		border-top: 2px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.theme-name {
			display: none;
		}
		
		.theme-option {
			padding: 0.5rem;
		}
	}
</style>