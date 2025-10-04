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

	// Size variants - using theme-aware spacing and fonts
	const sizes = {
		sm: 'px-sm py-xs text-sm',
		md: 'px-md py-sm text-base',
		lg: 'px-lg py-md text-lg'
	};

	const inputClasses = $derived(
		cn(
			// Base styles - using theme-aware classes
			'w-full rounded-md border bg-surface font-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
			
			// Size styles
			sizes[size],
			
			// State styles
			{
				'border focus:border-primary focus:ring-primary': !hasError && !disabled,
				'border-error focus:border-error focus:ring-error': hasError,
				'bg-surface-hover border cursor-not-allowed': disabled,
				'bg-surface-hover': readonly,
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
			'block text-sm font-medium text-neutral-900 font-primary',
			{ 'text-danger-600': hasError }
		)}>
			{label}
			{#if required}
				<span class="text-danger-600 ml-1">*</span>
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
		<div id="{id}-error" class="flex items-center gap-xs text-sm text-danger-600 font-primary">
			<AlertCircle class="h-4 w-4" />
			{error}
		</div>
	{:else if hint}
		<div id="{id}-hint" class="text-sm text-neutral-600 font-primary">
			{hint}
		</div>
	{/if}
</div>