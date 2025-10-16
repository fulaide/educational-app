<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();
</script>

<!-- <div class="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 {className || ''}">
	<div class="max-w-md w-full space-y-8">
		{@render children()}
	</div>
</div>
 -->

<div class="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 grid grid-cols-1 place-content-center py-12 px-4 sm:px-6 lg:px-8 {className || ''}">
	<div class="grid grid-cols-1 max-w-7xl mx-auto lg:grid-cols-2 gap-6 lg:gap-12 w-full  items-center justify-items-center ">
		
		{@render children()}

	</div>
</div>