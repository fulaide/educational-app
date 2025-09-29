<script lang="ts">
	import type { PageData } from './$types'
	
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Email Verification - Educational App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
	<div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
		<div class="text-center mb-6">
			<div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full {data.success ? 'bg-green-100' : 'bg-red-100'}">
				{#if data.success}
					<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				{:else}
					<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
					</svg>
				{/if}
			</div>
			
			<h1 class="text-2xl font-bold text-gray-900 mb-2">
				{data.success ? 'Email Verified!' : 'Verification Failed'}
			</h1>
			
			<p class="text-gray-600 leading-relaxed">
				{data.message}
			</p>
		</div>

		{#if data.success}
			<div class="space-y-4">
				{#if data.alreadyVerified}
					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm text-blue-800">
									Your email was verified previously. You have full access to all features.
								</p>
							</div>
						</div>
					</div>
				{:else}
					<div class="bg-green-50 border border-green-200 rounded-lg p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm text-green-800">
									You now have full access to your teacher dashboard and can:
								</p>
								<ul class="mt-2 text-sm text-green-700 list-disc list-inside space-y-1">
									<li>Create and manage classes</li>
									<li>Track student progress</li>
									<li>Customize learning modules</li>
									<li>Access all platform features</li>
								</ul>
							</div>
						</div>
					</div>
				{/if}
				
				<a 
					href="/dashboard" 
					class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-block text-center"
				>
					Go to Dashboard
				</a>
			</div>
		{:else}
			<div class="space-y-4">
				{#if data.expired && data.email}
					<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm text-yellow-800">
									The verification link has expired, but you can request a new one.
								</p>
							</div>
						</div>
					</div>
					
					<a 
						href="/auth/resend-verification?email={encodeURIComponent(data.email)}" 
						class="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors inline-block text-center"
					>
						Resend Verification Email
					</a>
				{/if}
				
				<div class="flex space-x-3">
					<a 
						href="/auth/signin" 
						class="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
					>
						Sign In
					</a>
					<a 
						href="/auth/register" 
						class="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-center"
					>
						Register
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>