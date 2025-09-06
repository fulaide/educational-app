<script lang="ts">
	import { cn, type ColorVariant } from '$lib/utils/index.js';
	import type { Snippet } from 'svelte';
	import { LoaderCircle } from 'lucide-svelte';

	type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft';
	type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

	interface Props {
		variant?: ButtonVariant;
		color?: ColorVariant;
		size?: ButtonSize;
		disabled?: boolean;
		loading?: boolean;
		fullWidth?: boolean;
		rounded?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'solid',
		color = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		fullWidth = false,
		rounded = false,
		type = 'button',
		onclick,
		class: className,
		children
	}: Props = $props();

	// Reactive state using Svelte 5 runes
	const isDisabled = $derived(disabled || loading);

	// Style variants - using design tokens
	const variants = {
		solid: {
			primary: 'btn-primary',
			secondary: 'btn-secondary',
			success: 'bg-green-600 hover:bg-green-700 text-white',
			danger: 'bg-red-600 hover:bg-red-700 text-white',
			warning: 'bg-amber-600 hover:bg-amber-700 text-white'
		},
		outline: {
			primary: 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
			secondary: 'border border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white',
			success: 'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
			danger: 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
			warning: 'border border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
		},
		ghost: {
			primary: 'text-brand hover:surface-secondary',
			secondary: 'text-secondary hover:surface-secondary',
			success: 'text-success hover:surface-secondary',
			danger: 'text-error hover:surface-secondary',
			warning: 'text-warning hover:surface-secondary'
		},
		soft: {
			primary: 'surface-secondary text-brand hover:surface-tertiary',
			secondary: 'surface-secondary text-secondary hover:surface-tertiary',
			success: 'surface-secondary text-success hover:surface-tertiary',
			danger: 'surface-secondary text-error hover:surface-tertiary',
			warning: 'surface-secondary text-warning hover:surface-tertiary'
		}
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm font-medium',
		md: 'px-4 py-2.5 text-base font-medium',
		lg: 'px-6 py-3 text-lg font-medium',
		xl: 'px-8 py-4 text-xl font-semibold'
	};

	const buttonClasses = $derived(
		cn(
			// Base styles - using design tokens
			'inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-0 rounded-lg',
			
			// Size styles
			sizes[size],
			
			// Variant and color styles
			variants[variant][color],
			
			// Conditional styles
			{
				'w-full': fullWidth,
				'rounded-full': rounded,
				'rounded-lg': !rounded,
				'opacity-50 cursor-not-allowed': isDisabled,
				'hover:scale-[1.02] active:scale-[0.98]': !isDisabled,
				'focus:ring-primary': color === 'primary',
				'focus:ring-secondary': color === 'secondary', 
				'focus:ring-success': color === 'success',
				'focus:ring-error': color === 'danger',
				'focus:ring-warning': color === 'warning'
			},
			
			// Custom classes
			className
		)
	);

	function handleClick() {
		if (!isDisabled && onclick) {
			onclick();
		}
	}
</script>

<button
	{type}
	class={buttonClasses}
	disabled={isDisabled}
	onclick={handleClick}
	aria-busy={loading}
>
	{#if loading}
		<LoaderCircle class="h-4 w-4 animate-spin" />
	{/if}
	
	{#if children}
		{@render children()}
	{/if}
</button>