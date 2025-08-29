<script lang="ts">
	import { cn } from '$lib/utils/index.js';
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

	// Variant styles
	const variants = {
		default: 'bg-white border border-gray-200',
		elevated: 'bg-white shadow-soft',
		outlined: 'bg-white border-2 border-gray-200',
		soft: 'bg-gray-50 border border-gray-100'
	};

	// Padding styles
	const paddings = {
		none: '',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6',
		xl: 'p-8'
	};

	const cardClasses = $derived(
		cn(
			// Base styles
			'rounded-xl transition-all duration-200',
			
			// Variant styles
			variants[variant],
			
			// Padding styles
			paddings[padding],
			
			// Interactive styles
			{
				'hover:shadow-md hover:-translate-y-0.5': hoverable,
				'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2': clickable,
				'hover:border-primary-200': clickable && variant !== 'elevated'
			},
			
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