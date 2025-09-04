<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		onSubmit?: (loading: boolean) => void;
		onResult?: (data: { result: any, update: () => Promise<void> }) => Promise<void>;
		class?: string;
	}

	let { children, onSubmit, onResult, class: className }: Props = $props();
</script>

<form 
	class="mt-8 space-y-6 {className || ''}" 
	method="POST"
	use:enhance={() => {
		onSubmit?.(true);
		return async ({ result, update }) => {
			onSubmit?.(false);
			if (onResult) {
				await onResult({ result, update });
			} else {
				await update();
			}
		}
	}}
>
	{@render children()}
</form>