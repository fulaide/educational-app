<script lang="ts">
	import type { ActionData, PageData } from './$types'
	import { enhance } from '$app/forms'
	
	export let data: PageData
	export let form: ActionData
	
	let isSubmitting = false
</script>

<svelte:head>
	<title>Resend Verification Email - Educational App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
	<div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
		<div class="text-center mb-6">
			<div class="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
				<svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
				</svg>
			</div>
			
			<h1 class="text-2xl font-bold text-gray-900 mb-2">Resend Verification Email</h1>
			<p class="text-gray-600">Enter your email to receive a new verification link</p>
		</div>

		{#if form?.success}
			<div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">Email Sent Successfully!</h3>
						<p class="mt-1 text-sm text-green-700">{form.message}</p>
						<p class="mt-2 text-sm text-green-700">
							<strong>Next steps:</strong>
						</p>
						{#if form?.isDevelopment}
							<ul class="mt-1 text-sm text-green-600 list-disc list-inside space-y-1">
								<li>Check the browser console for the verification link</li>
								<li>Copy the verification URL from the console logs</li>
								<li>Open the verification link in your browser</li>
								<li>In production, this would be sent via email</li>
							</ul>
						{:else}
							<ul class="mt-1 text-sm text-green-600 list-disc list-inside space-y-1">
								<li>Check your inbox for the verification email</li>
								<li>Don't forget to check your spam/junk folder</li>
								<li>Click the verification link in the email</li>
								<li>The link will expire in 24 hours</li>
							</ul>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm text-red-800">{form.error}</p>
					</div>
				</div>
			</div>
		{/if}

		{#if !form?.success}
			<form 
				method="POST" 
				use:enhance={() => {
					isSubmitting = true
					return async ({ update }) => {
						await update()
						isSubmitting = false
					}
				}}
				class="space-y-4"
			>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
						Email Address
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={form?.email || data.email}
						required
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						placeholder="your.email@example.com"
						disabled={isSubmitting}
					/>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
				>
					{#if isSubmitting}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Sending Email...
					{:else}
						Send Verification Email
					{/if}
				</button>
			</form>

			<div class="mt-6 text-center space-y-3">
				<p class="text-sm text-gray-500">
					Already have an account?
					<a href="/auth/signin" class="text-indigo-600 hover:text-indigo-800 font-medium">
						Sign in
					</a>
				</p>
				
				<p class="text-sm text-gray-500">
					Don't have an account?
					<a href="/auth/register" class="text-indigo-600 hover:text-indigo-800 font-medium">
						Register here
					</a>
				</p>
			</div>
		{:else}
			<div class="mt-6 text-center">
				<a 
					href="/auth/signin" 
					class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
				>
					Back to Sign In
				</a>
			</div>
		{/if}
	</div>
</div>