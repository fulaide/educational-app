<script lang="ts">
	import { cn, generateId } from '$lib/utils/index.js';
	import { AlertCircle, Eye, EyeOff } from 'lucide-svelte';

	type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
	type InputSize = 'sm' | 'md' | 'lg';

	interface Props {
		type?: InputType;
		size?: InputSize;
		placeholder?: string;
		value?: string;
		label?: string;
		error?: string;
		hint?: string;
		disabled?: boolean;
		required?: boolean;
		readonly?: boolean;
		autocomplete?: string;
		maxlength?: number;
		minlength?: number;
		pattern?: string;
		id?: string;
		name?: string;
		class?: string;
		onchange?: (value: string) => void;
		oninput?: (value: string) => void;
		onfocus?: () => void;
		onblur?: () => void;
	}

	let {
		type = 'text',
		size = 'md',
		placeholder,
		value = $bindable(''),
		label,
		error,
		hint,
		disabled = false,
		required = false,
		readonly = false,
		autocomplete,
		maxlength,
		minlength,
		pattern,
		id = generateId('input'),
		name,
		class: className,
		onchange,
		oninput,
		onfocus,
		onblur
	}: Props = $props();

	// State for password visibility toggle
	let showPassword = $state(false);
	
	// Derived state
	const hasError = $derived(!!error);
	const actualType = $derived(type === 'password' && showPassword ? 'text' : type);
	const showPasswordToggle = $derived(type === 'password');

	// Size variants
	const sizes = {
		sm: 'px-3 py-2 text-sm',
		md: 'px-4 py-2.5 text-sm',
		lg: 'px-4 py-3 text-base'
	};

	const inputClasses = $derived(
		cn(
			// Base styles
			'w-full rounded-lg border bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
			
			// Size styles
			sizes[size],
			
			// State styles
			{
				'border-gray-300 focus:border-primary-500 focus:ring-primary-500': !hasError && !disabled,
				'border-danger-300 focus:border-danger-500 focus:ring-danger-500': hasError,
				'bg-gray-50 border-gray-200 cursor-not-allowed': disabled,
				'bg-gray-50': readonly,
				'pr-10': showPasswordToggle
			},
			
			// Custom classes
			className
		)
	);

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		oninput?.(value);
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		onchange?.(value);
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<div class="space-y-2">
	{#if label}
		<label for={id} class={cn(
			'block text-sm font-medium text-gray-700',
			{ 'text-danger-700': hasError }
		)}>
			{label}
			{#if required}
				<span class="text-danger-500 ml-1">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative">
		<input
			{id}
			{name}
			type={actualType}
			{placeholder}
			{value}
			{disabled}
			{readonly}
			{required}
			{autocomplete}
			{maxlength}
			{minlength}
			{pattern}
			class={inputClasses}
			aria-invalid={hasError}
			aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
			oninput={handleInput}
			onchange={handleChange}
			onfocus={() => onfocus?.()}
			onblur={() => onblur?.()}
		/>

		{#if showPasswordToggle}
			<button
				type="button"
				class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
				onclick={togglePasswordVisibility}
				tabindex="-1"
			>
				{#if showPassword}
					<EyeOff class="h-4 w-4" />
				{:else}
					<Eye class="h-4 w-4" />
				{/if}
			</button>
		{/if}
	</div>

	{#if error}
		<div id="{id}-error" class="flex items-center gap-1 text-sm text-danger-600">
			<AlertCircle class="h-4 w-4" />
			{error}
		</div>
	{:else if hint}
		<div id="{id}-hint" class="text-sm text-gray-500">
			{hint}
		</div>
	{/if}
</div>