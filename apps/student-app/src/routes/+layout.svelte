<script lang="ts">
	import { onMount } from 'svelte';
	import { initI18n, localeManager } from '@educational-app/i18n';
	import { createNotificationContext, ToastContainer } from '@educational-app/ui';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	// Initialize toast notifications
	const notifications = createNotificationContext();

	// Initialize i18n synchronously for SSR compatibility
	initI18n();

	let currentLocale = $state('de');

	onMount(() => {
		// Initialize current locale and set document language
		currentLocale = localeManager.getCurrentLocale();
		document.documentElement.lang = currentLocale;

		// Listen for locale changes
		const updateDocumentLang = () => {
			const newLocale = localeManager.getCurrentLocale();
			currentLocale = newLocale;
			document.documentElement.lang = newLocale;
		};

		updateDocumentLang();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<!-- Toast notifications -->
<ToastContainer position="top-right" />
