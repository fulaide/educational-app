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
	<label for={id} class="form-label">
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
		class="form-input {error ? 'form-input-error' : ''}"
	/>
	{#if error}
		<p class="form-error">{error}</p>
	{/if}
</div>