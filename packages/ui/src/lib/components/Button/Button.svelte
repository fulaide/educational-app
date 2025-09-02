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

	// Style variants - using consistent classes that adapt to theme
	const variants = {
		solid: {
			primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm',
			secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-sm',
			success: 'bg-success hover:bg-success text-white shadow-sm',
			danger: 'bg-error hover:bg-error text-white shadow-sm',
			warning: 'bg-warning hover:bg-warning text-white shadow-sm'
		},
		outline: {
			primary: 'border border-primary text-primary hover:bg-primary hover:text-white',
			secondary: 'border border-secondary text-secondary hover:bg-secondary hover:text-white',
			success: 'border border-success text-success hover:bg-success hover:text-white',
			danger: 'border border-error text-error hover:bg-error hover:text-white',
			warning: 'border border-warning text-warning hover:bg-warning hover:text-white'
		},
		ghost: {
			primary: 'text-primary hover:bg-surface-hover',
			secondary: 'text-secondary hover:bg-surface-hover',
			success: 'text-success hover:bg-surface-hover',
			danger: 'text-error hover:bg-surface-hover',
			warning: 'text-warning hover:bg-surface-hover'
		},
		soft: {
			primary: 'bg-surface-hover text-primary hover:bg-surface-selected',
			secondary: 'bg-surface-hover text-secondary hover:bg-surface-selected',
			success: 'bg-surface-hover text-success hover:bg-surface-selected',
			danger: 'bg-surface-hover text-error hover:bg-surface-selected',
			warning: 'bg-surface-hover text-warning hover:bg-surface-selected'
		}
	};

	const sizes = {
		sm: 'px-sm py-xs text-sm font-medium',
		md: 'px-md py-sm text-base font-medium',
		lg: 'px-lg py-md text-lg font-medium',
		xl: 'px-xl py-lg text-xl font-semibold'
	};

	const buttonClasses = $derived(
		cn(
			// Base styles - using theme-aware classes
			'inline-flex items-center justify-center gap-sm font-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
			
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