<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData

	async function handleSignOut() {
		// Navigate to logout route for proper server-side session clearing
		window.location.href = '/auth/signout'
	}
</script>

<svelte:head>
	<title>Dashboard - Educational App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<nav class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex">
					<div class="flex flex-shrink-0 items-center">
						<h1 class="text-xl font-semibold text-gray-900">Educational App</h1>
					</div>
				</div>
				<div class="flex items-center space-x-4">
					<div class="flex items-center space-x-2">
						<div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
							<span class="text-sm font-medium text-white">
								{data.user?.name?.charAt(0) || data.user?.email?.charAt(0) || '?'}
							</span>
						</div>
						<span class="text-sm text-gray-700">
							{data.user?.name || data.user?.email || 'Guest'}
						</span>
						<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							{data.user?.role || 'GUEST'}
						</span>
					</div>
					<button
						on:click={handleSignOut}
						class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
					>
						Sign Out
					</button>
				</div>
			</div>
		</div>
	</nav>

	<div class="py-10">
		<!-- Email Verification Banner -->
		{#if data.emailVerificationStatus && !data.emailVerificationStatus.isVerified}
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
				<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3 flex-1">
							<h3 class="text-sm font-medium text-yellow-800">
								Email Verification Required
							</h3>
							<div class="mt-2 text-sm text-yellow-700">
								<p>Your email address hasn't been verified yet. Please check your inbox and click the verification link to access all features.</p>
							</div>
							<div class="mt-4 flex space-x-3">
								<a
									href="/auth/resend-verification?email={encodeURIComponent(data.user?.email || '')}"
									class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
								>
									Resend Verification Email
								</a>
								<span class="text-xs text-yellow-600 flex items-center">
									Check your spam folder if you don't see the email
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<header>
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h1 class="text-3xl font-bold leading-tight text-gray-900">
					Welcome, {data.user?.name || 'Guest'}!
				</h1>
			</div>
		</header>
		<main>
			<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div class="px-4 py-8 sm:px-0">
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<!-- User Info Card -->
						<div class="overflow-hidden bg-white shadow rounded-lg">
							<div class="p-6">
								<div class="flex items-center">
									<div class="flex-shrink-0">
										<div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
											<span class="text-lg font-medium text-white">
												{data.user?.name?.charAt(0) || data.user?.email?.charAt(0) || '?'}
											</span>
										</div>
									</div>
									<div class="ml-5 w-0 flex-1">
										<dl>
											<dt class="text-sm font-medium text-gray-500 truncate">User Profile</dt>
											<dd class="text-lg font-medium text-gray-900">{data.user?.name || 'Unknown'}</dd>
										</dl>
									</div>
								</div>
								<div class="mt-4">
									<div class="text-sm text-gray-500">
										<p><strong>Email:</strong> {data.user?.email || 'N/A'}
											{#if data.emailVerificationStatus}
												{#if data.emailVerificationStatus.isVerified}
													<span class="inline-flex items-center ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
														<svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
															<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
														</svg>
														Verified
													</span>
												{:else}
													<span class="inline-flex items-center ml-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
														<svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
															<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
														</svg>
														Unverified
													</span>
												{/if}
											{/if}
										</p>
										<p><strong>Role:</strong> {data.user?.role || 'N/A'}</p>
										<p><strong>User ID:</strong> {data.user?.id || 'N/A'}</p>
										{#if data.user?.organizationId}
											<p><strong>Organization:</strong> {data.user?.organizationId}</p>
										{/if}
									</div>
								</div>
							</div>
						</div>

						<!-- Authentication Status Card -->
						<div class="overflow-hidden bg-white shadow rounded-lg">
							<div class="p-6">
								<div class="flex items-center">
									<div class="flex-shrink-0">
										<div class="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
											<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										</div>
									</div>
									<div class="ml-5 w-0 flex-1">
										<dl>
											<dt class="text-sm font-medium text-gray-500 truncate">Authentication</dt>
											<dd class="text-lg font-medium text-gray-900">Authenticated</dd>
										</dl>
									</div>
								</div>
								<div class="mt-4">
									<div class="text-sm text-gray-500">
										<p>You are successfully signed in!</p>
										<p>Multi-role authentication is working.</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Quick Actions Card -->
						<div class="overflow-hidden bg-white shadow rounded-lg">
							<div class="p-6">
								<div class="flex items-center">
									<div class="flex-shrink-0">
										<div class="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
											<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
												<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
										</div>
									</div>
									<div class="ml-5 w-0 flex-1">
										<dl>
											<dt class="text-sm font-medium text-gray-500 truncate">Quick Actions</dt>
											<dd class="text-lg font-medium text-gray-900">Dashboard Ready</dd>
										</dl>
									</div>
								</div>
								<div class="mt-4">
									<div class="text-sm text-gray-500">
										<p>Auth.js integration complete!</p>
										<p>Ready to build {data.user?.role?.toLowerCase() || 'user'} features.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>