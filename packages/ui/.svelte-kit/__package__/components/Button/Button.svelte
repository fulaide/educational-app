<script lang="ts">
	import { cn, type ColorVariant } from '../../utils/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

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

	// Style variants - using semantic tokens from @theme
	const variants = {
		solid: {
			primary: 'bg-primary-500 hover:bg-primary-600 text-white border border-transparent',
			secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white border border-transparent',
			success: 'bg-success-500 hover:bg-success-600 text-white border border-transparent',
			danger: 'bg-danger-500 hover:bg-danger-600 text-white border border-transparent',
			warning: 'bg-warning-500 hover:bg-warning-600 text-white border border-transparent'
		},
		outline: {
			primary: 'border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white bg-transparent',
			secondary: 'border border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-white bg-transparent',
			success: 'border border-success-500 text-success-500 hover:bg-success-500 hover:text-white bg-transparent',
			danger: 'border border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white bg-transparent',
			warning: 'border border-warning-500 text-warning-500 hover:bg-warning-500 hover:text-white bg-transparent'
		},
		ghost: {
			primary: 'text-primary-500 hover:bg-primary-50 border border-transparent',
			secondary: 'text-secondary-500 hover:bg-secondary-50 border border-transparent',
			success: 'text-success-500 hover:bg-success-50 border border-transparent',
			danger: 'text-danger-500 hover:bg-danger-50 border border-transparent',
			warning: 'text-warning-500 hover:bg-warning-50 border border-transparent'
		},
		soft: {
			primary: 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-transparent',
			secondary: 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border border-transparent',
			success: 'bg-success-50 text-success-600 hover:bg-success-100 border border-transparent',
			danger: 'bg-danger-50 text-danger-600 hover:bg-danger-100 border border-transparent',
			warning: 'bg-warning-50 text-warning-600 hover:bg-warning-100 border border-transparent'
		}
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg',
		xl: 'px-8 py-4 text-xl'
	};

	const buttonClasses = $derived(
		cn(
			// Base styles - using design tokens
			'inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg box-border',
			
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