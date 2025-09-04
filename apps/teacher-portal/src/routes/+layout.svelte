<script lang="ts">
	import { onMount } from 'svelte';
	import { initI18n, localeManager } from '@educational-app/i18n';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();

	// Initialize i18n synchronously for SSR compatibility  
	initI18n();

	onMount(() => {
		// Update document language when locale changes
		const currentLocale = localeManager.getCurrentLocale();
		document.documentElement.lang = currentLocale;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
