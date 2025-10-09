<script lang="ts">
	import { cn } from '../../utils/index.js';

	interface Props {
		id: string;
		name: string;
		label: string;
		placeholder?: string;
		value: string;
		required?: boolean;
		disabled?: boolean;
		autocomplete?: string;
		error?: string;
		showStrength?: boolean;
		class?: string;
	}

	let {
		id,
		name,
		label,
		placeholder,
		value = $bindable(),
		required = false,
		disabled = false,
		autocomplete = 'current-password',
		error,
		showStrength = false,
		class: className
	}: Props = $props();

	let showPassword = $state(false);

	// Password strength indicators
	const hasMinLength = $derived(value.length >= 8);
	const hasUppercase = $derived(/[A-Z]/.test(value));
	const hasLowercase = $derived(/[a-z]/.test(value));
	const hasNumber = $derived(/\d/.test(value));

	const strengthChecks = $derived([
		{ label: 'At least 8 characters', passed: hasMinLength },
		{ label: 'Uppercase letter', passed: hasUppercase },
		{ label: 'Lowercase letter', passed: hasLowercase },
		{ label: 'Number', passed: hasNumber }
	]);

	// Component-scoped style classes
	const labelClasses = "block text-sm font-medium text-neutral-900 mb-2";

	const inputClasses = $derived(cn(
		// Base styles
		"w-full pr-10 px-3 py-3 bg-surface border rounded-lg",
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

	const toggleButtonClasses = "absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-primary-600 transition-colors";
	const errorClasses = "mt-1 text-sm text-danger-600";
	const strengthContainerClasses = "mt-2 flex flex-col gap-1";
</script>

<div class={className}>
	<label for={id} class={labelClasses}>
		{label}
	</label>
	<div class="relative">
		<input
			{id}
			{name}
			type={showPassword ? 'text' : 'password'}
			{autocomplete}
			{required}
			{disabled}
			{placeholder}
			bind:value
			class={inputClasses}
		/>
		<button
			type="button"
			class={toggleButtonClasses}
			onclick={() => showPassword = !showPassword}
			disabled={disabled}
		>
			{#if showPassword}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
				</svg>
			{:else}
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
				</svg>
			{/if}
		</button>
	</div>


	{#if showStrength && value}
		<div class={strengthContainerClasses}>
			{#each strengthChecks as check}
				<div class="flex items-center gap-2">
					<div class="w-2 h-2 rounded-full {check.passed ? 'bg-success-400' : 'bg-neutral-200'}"></div>
					<span class="text-xs {check.passed ? 'text-success-600' : 'text-neutral-500'}">{check.label}</span>
				</div>
			{/each}
		</div>
	{/if}

	{#if error}
		<p class={errorClasses}>{error}</p>
	{/if}
</div>