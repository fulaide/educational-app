<script lang="ts">
	import { AppLayout, Sidebar, MainContent } from '@educational-app/ui';
	import { page } from '$app/stores';
	import { createTeacherNavigation, createAccountNavigation, getPageTitle } from '../navigation/teacher-navigation.js';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		/**
		 * User data from the server
		 */
		user?: {
			name?: string | null;
			email?: string | null;
			role?: string | null;
			avatar?: string | null;
		} | null;
		/**
		 * Optional badge counts for navigation items
		 */
		badges?: {
			classes?: number;
			students?: number;
		};
		/**
		 * Organization data
		 */
		organization?: {
			id?: string;
			name?: string;
		} | null;
		/**
		 * Custom page title override
		 */
		pageTitle?: string;
		/**
		 * Optional custom sidebar footer content
		 */
		sidebarFooter?: Snippet;
		/**
		 * Optional ad slot content for sidebar
		 */
		sidebarAd?: Snippet;
	}

	let {
		children,
		user,
		badges,
		organization,
		pageTitle,
		sidebarFooter,
		sidebarAd
	}: Props = $props();

	// Get current path reactively
	const currentPath = $derived($page.url.pathname);

	// Create navigation structure
	const navigation = $derived(createTeacherNavigation(currentPath, badges));
	const accountNavigation = $derived(createAccountNavigation(currentPath));

	// Determine user display info
	const userName = $derived(user?.name || user?.email || 'Teacher');
	const userRole = $derived(user?.role || 'TEACHER');
	const organizationName = $derived(organization?.name);

	// Footer info with user profile
	const footerData = $derived(() => {
		// Always return a footer object, even if user data is missing initially
		return {
			user: {
				name: user?.name || user?.email || 'Teacher',
				email: user?.email || undefined,
				avatar: user?.avatar || undefined,
				role: user?.role || 'TEACHER'
			},
			organization: organization?.name
		};
	});

	// Brand configuration
	const brand = {
		name: 'SparkLabs'
	};

	// Handle navigation clicks
	function handleNavigate(item: any) {
		// Handle special actions
		if (item.href === '/auth/signout') {
			// Handle sign out logic if needed
			window.location.href = item.href;
			return;
		}
		
		// Regular navigation
		window.location.href = item.href;
	}
</script>

<AppLayout theme="teacher">
	<!-- Sidebar with teacher navigation -->
	<Sidebar 
		navigation={navigation}
		brand={brand}
		footer={{
			user: {
				name: user?.name || user?.email || 'Teacher',
				email: user?.email || 'teacher@test.com',
				avatar: user?.avatar || null
			}
		}}
		onNavigate={handleNavigate}
		adSlot={sidebarAd}
	/>

	<!-- Main Content -->
	<MainContent>
		{#if children}
			{@render children()}
		{/if}
	</MainContent>
</AppLayout>