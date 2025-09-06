<script lang="ts">
	import { onMount } from 'svelte';
	import { initI18n, localeManager } from '@educational-app/i18n';
	import { createNotificationContext, ToastContainer } from '@educational-app/ui';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import type { LayoutData } from './$types';

	interface Props {
		children: any;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	// Initialize i18n synchronously for SSR compatibility  
	initI18n();
	
	// Create global notification context with custom config
	const notifications = createNotificationContext({
		defaultDuration: {
			success: 3000,
			error: 5000, 
			warning: 4000,
			info: 3000
		},
		maxNotifications: 5,
		enableAnimations: true
	});

	let currentLocale = $state('de');

	onMount(() => {
		// If user is authenticated and has a saved locale preference, use it
		if (data.userLocale) {
			localeManager.setLocale(data.userLocale);
			currentLocale = data.userLocale;
		} else {
			// Otherwise use the locale from localStorage or browser
			currentLocale = localeManager.getCurrentLocale();
		}
		
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

<!-- Global Toast Container -->
<ToastContainer position="top-right" maxVisible={5} />
