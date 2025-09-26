<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();
</script>

<div class="min-h-screen bg-gradient-to-br from-primary-500 to-accent-700  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 {className || ''}">
	<div class="max-w-md w-full space-y-8">
		{@render children()}
	</div>
</div>