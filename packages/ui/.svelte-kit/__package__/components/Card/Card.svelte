<script lang="ts">
	import { cn } from '../../utils/index.js';
	import type { Snippet } from 'svelte';

	type CardVariant = 'default' | 'elevated' | 'outlined' | 'soft';
	type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

	interface Props {
		variant?: CardVariant;
		padding?: CardPadding;
		hoverable?: boolean;
		clickable?: boolean;
		class?: string;
		onclick?: () => void;
		children?: Snippet;
	}

	let {
		variant = 'default',
		padding = 'md',
		hoverable = false,
		clickable = false,
		class: className,
		onclick,
		children
	}: Props = $props();

	// Base card styles
	const baseCardClasses = 'bg-white rounded-lg transition-colors duration-200';

	// Variant styles - using Tailwind utilities
	const variants = {
		default: 'border border-gray-200',
		elevated: 'shadow-sm',
		outlined: 'border border-gray-300',
		soft: 'bg-gray-50 border border-gray-100'
	};

	// Padding styles
	const paddings = {
		none: 'p-0',
		sm: 'p-2',
		md: 'p-4',
		lg: 'p-6',
		xl: 'p-8'
	};

	const cardClasses = $derived(
		cn(
			// Base styles
			baseCardClasses,

			// Variant style
			variants[variant],

			// Padding
			paddings[padding],

			// Interactive styles
			hoverable && 'hover:shadow-md! hover:border-gray-300',
			clickable && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',

			// Elevated variant hover enhancement (shadow-md -> shadow-xl)
			variant === 'elevated' && (hoverable || clickable) && 'hover:shadow-lg! hover:border-gray-300',

			// Custom classes
			className
		)
	);

	function handleClick() {
		if (clickable && onclick) {
			onclick();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (clickable && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			onclick?.();
		}
	}
</script>

{#if clickable}
	<div
		class={cardClasses}
		role="button"
		tabindex="0"
		onclick={handleClick}
		onkeydown={handleKeydown}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else}
	<div class={cardClasses}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}