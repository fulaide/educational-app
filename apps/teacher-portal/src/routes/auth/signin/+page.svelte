<script lang="ts">
	import { signIn } from '@auth/sveltekit/client'
	import { page } from '$app/stores'

	let activeTab: 'teacher' | 'parent' = 'teacher'
	let email = ''
	let password = ''
	let loading = false
	let error = ''

	const callbackUrl = $page.url.searchParams.get('callbackUrl') || '/dashboard'

	async function handleSubmit() {
		if (!email || !password) {
			error = 'Please fill in all fields'
			return
		}

		loading = true
		error = ''

		try {
			const result = await signIn(
				activeTab === 'teacher' ? 'teacher-login' : 'parent-login',
				{
					email,
					password,
					redirectTo: callbackUrl
				}
			)

			if (result?.error) {
				error = 'Invalid credentials. Please try again.'
			}
		} catch (err) {
			error = 'An error occurred. Please try again.'
			console.error('Sign in error:', err)
		} finally {
			loading = false
		}
	}

	function switchTab(tab: 'teacher' | 'parent') {
		activeTab = tab
		email = ''
		password = ''
		error = ''
	}
</script>

<svelte:head>
	<title>Sign In - Educational App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<div class="mx-auto h-12 w-12 text-indigo-600">
				<svg fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"/>
				</svg>
			</div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
				Welcome to Educational App
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Sign in to access your {activeTab} portal
			</p>
		</div>

		<!-- Tab Switcher -->
		<div class="flex rounded-lg bg-gray-200 p-1">
			<button
				type="button"
				class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 {activeTab === 'teacher' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
				on:click={() => switchTab('teacher')}
			>
				Teacher
			</button>
			<button
				type="button"
				class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 {activeTab === 'parent' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
				on:click={() => switchTab('parent')}
			>
				Parent
			</button>
		</div>

		<form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
			{#if error}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
					{error}
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">
						Email address
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						bind:value={email}
						class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="Enter your email"
						disabled={loading}
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={password}
						class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="Enter your password"
						disabled={loading}
					/>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div class="text-sm">
					<a href="/auth/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
						Forgot your password?
					</a>
				</div>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
			>
				{#if loading}
					<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Signing in...
				{:else}
					Sign in as {activeTab}
				{/if}
			</button>

			{#if activeTab === 'teacher'}
				<p class="mt-4 text-center text-sm text-gray-600">
					Need an account? <a href="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">Contact your administrator</a>
				</p>
			{:else}
				<p class="mt-4 text-center text-sm text-gray-600">
					Need access? <a href="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">Contact your child's teacher</a>
				</p>
			{/if}
		</form>
	</div>
</div>