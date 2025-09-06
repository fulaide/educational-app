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

	// Variant styles - using design tokens
	const variants = {
		default: 'card',
		elevated: 'card',
		outlined: 'card',
		soft: 'card'
	};

	// Padding overrides (card already has default padding)
	const paddings = {
		none: '!p-0',
		sm: '!p-2',
		md: '', // Use default card padding
		lg: '!p-6',
		xl: '!p-8'
	};

	const cardClasses = $derived(
		cn(
			// Base variant style
			variants[variant],
			
			// Padding overrides
			paddings[padding],
			
			// Interactive styles
			{
				'card-clickable': clickable || hoverable,
				'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2': clickable,
				'focus:ring-blue-500': clickable
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