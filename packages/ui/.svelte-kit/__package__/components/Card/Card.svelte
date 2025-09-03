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

	// Variant styles - using theme-aware classes
	const variants = {
		default: 'bg-surface border border',
		elevated: 'bg-surface shadow-lg',
		outlined: 'bg-surface border-2 border',
		soft: 'bg-surface-hover border border'
	};

	// Padding styles - using theme-aware spacing
	const paddings = {
		none: '',
		sm: 'p-sm',
		md: 'p-md',
		lg: 'p-lg',
		xl: 'p-xl'
	};

	const cardClasses = $derived(
		cn(
			// Base styles - using theme-aware classes
			'rounded-lg transition-all duration-200 font-primary',
			
			// Variant styles
			variants[variant],
			
			// Padding styles
			paddings[padding],
			
			// Interactive styles
			{
				'hover:shadow-lg hover:-translate-y-0.5': hoverable,
				'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2': clickable,
				'hover:border-primary': clickable && variant !== 'elevated'
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