<script lang="ts">
	import { onMount } from 'svelte';
	import { initI18n, localeManager } from '@educational-app/i18n';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();

	// Initialize i18n synchronously for SSR compatibility  
	initI18n();

	let currentLocale = $state('de');

	onMount(() => {
		// Initialize current locale and set document language
		currentLocale = localeManager.getCurrentLocale();
		document.documentElement.lang = currentLocale;
		
		// Listen for locale changes (if using custom events)
		// This ensures the document lang updates when locale switches happen
		const updateDocumentLang = () => {
			const newLocale = localeManager.getCurrentLocale();
			currentLocale = newLocale;
			document.documentElement.lang = newLocale;
		};
		
		// Set up a mutation observer or custom event listener if needed
		// For now, the LocaleSwitcher component handles updates directly
		updateDocumentLang();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
