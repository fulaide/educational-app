<script lang="ts">
	import { cn } from '../../utils/index.js';

	interface Props {
		id: string;
		name: string;
		type?: 'text' | 'email' | 'tel' | 'url';
		label: string;
		placeholder?: string;
		value: string;
		required?: boolean;
		disabled?: boolean;
		autocomplete?: string;
		error?: string;
		class?: string;
	}

	let {
		id,
		name,
		type = 'text',
		label,
		placeholder,
		value = $bindable(),
		required = false,
		disabled = false,
		autocomplete,
		error,
		class: className
	}: Props = $props();

	// Component-scoped style classes
	const labelClasses = "block text-sm font-medium text-neutral-900 mb-2";

	const inputClasses = $derived(cn(
		// Base styles
		"w-full px-3 py-3 bg-surface border rounded-lg",
		"text-neutral-900 placeholder:text-neutral-400",
		"transition-colors duration-200",
		// Focus states
		"focus:outline-none focus:border-primary-500",
		"focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary-500)_10%,transparent)]",
		// Disabled state
		"disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-neutral-100",
		// Error state
		error && "border-danger-500 focus:border-danger-500 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-danger-500)_10%,transparent)]",
		!error && "border-neutral-200"
	));

	const errorClasses = "mt-1 text-sm text-danger-600";
</script>

<div class={className}>
	<label for={id} class={labelClasses}>
		{label}
	</label>
	<input
		{id}
		{name}
		{type}
		{autocomplete}
		{required}
		{disabled}
		{placeholder}
		bind:value
		class={inputClasses}
	/>
	{#if error}
		<p class={errorClasses}>{error}</p>
	{/if}
</div>