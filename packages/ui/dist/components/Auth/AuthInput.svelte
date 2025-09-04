<script lang="ts">
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
</script>

<div class={className}>
	<label for={id} class="block text-sm font-medium text-gray-700">
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
		class="mt-1 appearance-none relative block w-full px-3 py-2 border {error ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
	/>
	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>