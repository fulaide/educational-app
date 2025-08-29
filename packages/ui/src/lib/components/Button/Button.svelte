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

	// Style variants
	const variants = {
		solid: {
			primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
			secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm',
			success: 'bg-success-600 hover:bg-success-700 text-white shadow-sm',
			danger: 'bg-danger-600 hover:bg-danger-700 text-white shadow-sm',
			warning: 'bg-warning-600 hover:bg-warning-700 text-white shadow-sm'
		},
		outline: {
			primary: 'border border-primary-300 text-primary-700 hover:bg-primary-50',
			secondary: 'border border-secondary-300 text-secondary-700 hover:bg-secondary-50',
			success: 'border border-success-300 text-success-700 hover:bg-success-50',
			danger: 'border border-danger-300 text-danger-700 hover:bg-danger-50',
			warning: 'border border-warning-300 text-warning-700 hover:bg-warning-50'
		},
		ghost: {
			primary: 'text-primary-700 hover:bg-primary-50',
			secondary: 'text-secondary-700 hover:bg-secondary-50',
			success: 'text-success-700 hover:bg-success-50',
			danger: 'text-danger-700 hover:bg-danger-50',
			warning: 'text-warning-700 hover:bg-warning-50'
		},
		soft: {
			primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
			secondary: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
			success: 'bg-success-100 text-success-700 hover:bg-success-200',
			danger: 'bg-danger-100 text-danger-700 hover:bg-danger-200',
			warning: 'bg-warning-100 text-warning-700 hover:bg-warning-200'
		}
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm font-medium',
		md: 'px-4 py-2 text-sm font-medium',
		lg: 'px-6 py-3 text-base font-medium',
		xl: 'px-8 py-4 text-lg font-semibold'
	};

	const buttonClasses = $derived(
		cn(
			// Base styles
			'inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
			
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
				'focus:ring-primary-500': color === 'primary',
				'focus:ring-secondary-500': color === 'secondary',
				'focus:ring-success-500': color === 'success',
				'focus:ring-danger-500': color === 'danger',
				'focus:ring-warning-500': color === 'warning'
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