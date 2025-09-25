<script lang="ts">
	import Button from '../Button/Button.svelte';
	import type { ColorVariant } from '$lib/utils/index.js';
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'solid' | 'outline' | 'ghost' | 'soft';
		color?: ColorVariant;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		loading?: boolean;
		disabled?: boolean;
		fullWidth?: boolean;
		children?: Snippet;
		class?: string;
		onclick?: () => void;
	}

	let { 
		type = 'submit',
		variant = 'solid',
		color = 'primary',
		size = 'lg',
		loading = false,
		disabled = false,
		fullWidth = true, // Auth buttons are full width by default
		children,
		class: className,
		onclick
	}: Props = $props();
</script>

<Button
	{type}
	{variant}
	{color}
	{size}
	{loading}
	{disabled}
	{fullWidth}
	{onclick}
	class={className}
>
	{#if children}
		{@render children()}
	{/if}
</Button>