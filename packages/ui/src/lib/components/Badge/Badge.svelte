<script lang="ts">
	import { cn } from '$lib/utils/index.js';
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
		size?: 'sm' | 'md';
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'neutral',
		size = 'sm',
		class: className,
		children
	}: Props = $props();

	const variants = {
		neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
		primary: 'bg-primary-50 text-primary-700 border-primary-200',
		secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
		success: 'bg-success-50 text-success-700 border-success-200',
		warning: 'bg-warning-50 text-warning-700 border-warning-200',
		danger: 'bg-danger-50 text-danger-700 border-danger-200',
		info: 'bg-info-50 text-info-700 border-info-200'
	};

	const sizes = {
		sm: 'text-xs px-2 py-0.5',
		md: 'text-sm px-2.5 py-1'
	};

	const badgeClasses = $derived(
		cn(
			'inline-flex items-center gap-1 rounded border font-medium',
			variants[variant],
			sizes[size],
			className
		)
	);
</script>

<span class={badgeClasses}>
	{#if children}
		{@render children()}
	{/if}
</span>
