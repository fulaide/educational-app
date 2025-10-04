<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		showLogo?: boolean;
	}

	let { title, subtitle, showLogo = true }: Props = $props();
</script>

<div class="text-center mb-8">
	{#if showLogo}
		<div class="mx-auto mb-6 h-12 w-12 text-primary-600">
			<svg fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"/>
			</svg>
		</div>
	{/if}

	<h2 class="text-3xl font-bold text-neutral-900 mb-2 text-center">
		{title}
	</h2>

	{#if subtitle}
		<p class="text-sm text-neutral-600 text-center">
			{subtitle}
		</p>
	{/if}
</div>