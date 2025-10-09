<script lang="ts">
	interface Props {
		message: string;
		class?: string;
	}

	let { message, class: className }: Props = $props();
</script>

{#if message}
	<div class="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md text-sm {className || ''}">
		{message}
	</div>
{/if}