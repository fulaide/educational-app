<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		showLogo?: boolean;
	}

	let { title, subtitle, showLogo = true }: Props = $props();
</script>

<div>
	{#if showLogo}
		<div class="mx-auto h-12 w-12 text-indigo-600">
			<svg fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"/>
			</svg>
		</div>
	{/if}
	
	<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
		{title}
	</h2>
	
	{#if subtitle}
		<p class="mt-2 text-center text-sm text-gray-600">
			{subtitle}
		</p>
	{/if}
</div>