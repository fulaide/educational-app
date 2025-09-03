<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	
	export type ThemeType = 'student' | 'teacher' | 'parent' | 'admin';
	
	interface Props {
		theme: ThemeType;
		children: Snippet;
	}
	
	let { theme, children }: Props = $props();
	
	// Reactive theme context
	const themeContext = $state({
		current: theme,
		setTheme: (newTheme: ThemeType) => {
			themeContext.current = newTheme;
			updateDOMTheme(newTheme);
		}
	});
	
	// Set theme context for child components
	setContext('theme', themeContext);
	
	// Update DOM with theme data attribute
	function updateDOMTheme(themeName: ThemeType) {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', themeName);
		}
	}
	
	// Initialize theme on mount
	onMount(() => {
		updateDOMTheme(theme);
	});
	
	// React to theme prop changes
	$effect(() => {
		themeContext.current = theme;
		updateDOMTheme(theme);
	});
</script>

<!-- Load theme CSS -->
{#if theme === 'student'}
	<link rel="stylesheet" href="/themes/student.css" />
{:else if theme === 'teacher'}
	<link rel="stylesheet" href="/themes/teacher.css" />
{:else if theme === 'parent'}
	<link rel="stylesheet" href="/themes/parent.css" />
{:else if theme === 'admin'}
	<link rel="stylesheet" href="/themes/admin.css" />
{/if}

<div data-theme={theme}>
	{@render children()}
</div>