<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	// TODO: Import ThemeProvider from shared UI package

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
