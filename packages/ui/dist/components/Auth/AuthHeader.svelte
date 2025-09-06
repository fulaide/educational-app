<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
		showLogo?: boolean;
	}

	let { title, subtitle, showLogo = true }: Props = $props();
</script>

<div class="auth-header">
	{#if showLogo}
		<div class="auth-logo">
			<svg fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"/>
			</svg>
			</div>
	{/if}
	
	<h2 class="heading-1 text-center">
		{title}
	</h2>
	
	{#if subtitle}
		<p class="body-sm text-secondary text-center">
			{subtitle}
		</p>
	{/if}
</div>