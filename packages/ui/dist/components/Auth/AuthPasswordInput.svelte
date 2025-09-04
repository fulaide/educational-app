<script lang="ts">
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
</script>

<div class={className}>
	<label for={id} class="block text-sm font-medium text-gray-700">
		{label}
	</label>
	<div class="mt-1 relative">
		<input
			{id}
			{name}
			type={showPassword ? 'text' : 'password'}
			{autocomplete}
			{required}
			{disabled}
			{placeholder}
			bind:value
			class="appearance-none relative block w-full px-3 py-2 pr-10 border {error ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
		/>
		<button
			type="button"
			class="absolute inset-y-0 right-0 pr-3 flex items-center"
			onclick={() => showPassword = !showPassword}
			disabled={disabled}
		>
			{#if showPassword}
				<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
				</svg>
			{:else}
				<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
				</svg>
			{/if}
		</button>
	</div>
	
	{#if showStrength && value}
		<div class="mt-1 text-xs text-gray-500 space-y-1">
			{#each strengthChecks as check}
				<div class="flex items-center space-x-2">
					<div class="w-2 h-2 rounded-full {check.passed ? 'bg-green-400' : 'bg-gray-300'}"></div>
					<span>{check.label}</span>
				</div>
			{/each}
		</div>
	{/if}
	
	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>