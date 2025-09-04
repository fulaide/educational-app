<script lang="ts">
	interface Props {
		message: string;
		class?: string;
	}

	let { message, class: className }: Props = $props();
</script>

{#if message}
	<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm {className || ''}">
		{message}
	</div>
{/if}