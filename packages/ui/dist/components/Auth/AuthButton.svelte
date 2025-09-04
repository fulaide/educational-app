<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary';
		loading?: boolean;
		disabled?: boolean;
		loadingText?: string;
		children: Snippet;
		class?: string;
		onclick?: () => void;
	}

	let { 
		type = 'submit',
		variant = 'primary',
		loading = false,
		disabled = false,
		loadingText = 'Loading...',
		children,
		class: className,
		onclick
	}: Props = $props();

	const isDisabled = $derived(disabled || loading);

	const baseClasses = 'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200';
	
	const variantClasses = $derived({
		primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
		secondary: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500'
	}[variant]);

	const buttonClasses = $derived(`${baseClasses} ${variantClasses} ${className || ''}`);
</script>

<button
	{type}
	disabled={isDisabled}
	class={buttonClasses}
	{onclick}
>
	{#if loading}
		<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
		{loadingText}
	{:else}
		{@render children()}
	{/if}
</button>