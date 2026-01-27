<script lang="ts">
	import { goto } from '$app/navigation';
	import { authService } from '$lib/services/auth.svelte.ts';
	import { Button } from '@educational-app/ui';
	import { BookOpen, Home, LogOut, Trophy, User, WifiOff } from 'lucide-svelte';

	// Get current user from auth service
	const user = $derived(authService.currentUser)
	const isOnline = $derived(authService.isOnline)

	// Current active route
	let currentPath = $state('')

	// Update current path when component mounts
	if (typeof window !== 'undefined') {
		currentPath = window.location.pathname
	}

	function handleLogout() {
		authService.logout()
	}

	function navigateTo(path: string) {
		currentPath = path
		goto(path)
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
	<!-- Header -->
	<header class="bg-white shadow-sm sticky top-0 z-10">
		<div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
			<!-- User Profile -->
			<div class="flex items-center space-x-3">
				<div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
					{#if user?.name}
						{user.name.charAt(0).toUpperCase()}
					{:else}
						S
					{/if}
				</div>
				<div>
					<p class="text-sm font-medium text-neutral-900">
						{user?.name || 'Student'}
					</p>
					{#if user?.grade}
						<p class="text-xs text-neutral-600">Grade {user.grade}</p>
					{/if}
				</div>
			</div>

			<!-- Status Indicators -->
			<div class="flex items-center space-x-2">
				<!-- Offline Indicator -->
				{#if !isOnline}
					<div class="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
						<WifiOff class="w-3 h-3" />
						<span>Offline</span>
					</div>
				{/if}

				<!-- Logout Button -->
				<Button variant="ghost" size="sm" onclick={handleLogout} class="text-neutral-600 hover:text-neutral-900">
					<LogOut class="w-4 h-4" />
				</Button>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 overflow-y-auto pb-20">
		<slot />
	</main>

	<!-- Bottom Navigation -->
	<nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 safe-bottom">
		<div class="max-w-7xl mx-auto px-4 py-2 flex justify-around items-center">
			<button
				onclick={() => navigateTo('/dashboard')}
				class="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors {currentPath === '/dashboard' ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-50'}"
			>
				<Home class="w-5 h-5" />
				<span class="text-xs font-medium">Home</span>
			</button>

			<button
				onclick={() => navigateTo('/vocabulary')}
				class="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors {currentPath.startsWith('/vocabulary') ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-50'}"
			>
				<BookOpen class="w-5 h-5" />
				<span class="text-xs font-medium">Learn</span>
			</button>

			<button
				onclick={() => navigateTo('/math-challenge')}
				class="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors {currentPath.startsWith('/vocabulary') ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-50'}"
			>
				<BookOpen class="w-5 h-5" />
				<span class="text-xs font-medium">Math</span>
			</button>

			<button
				onclick={() => navigateTo('/math-test')}
				class="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors {currentPath === '/achievements' ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-50'}"
			>
				<Trophy class="w-5 h-5" />
				<span class="text-xs font-medium">Test</span>
			</button>

			<button
				onclick={() => navigateTo('/profile')}
				class="flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors {currentPath === '/profile' ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-50'}"
			>
				<User class="w-5 h-5" />
				<span class="text-xs font-medium">Me</span>
			</button>
		</div>
	</nav>
</div>

<style>
	/* Safe area padding for mobile devices */
	.safe-bottom {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
