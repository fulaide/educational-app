<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'

	export let form: ActionData

	let email = ''
	let loading = false
	let submitted = false
</script>

<svelte:head>
	<title>Forgot Password - Educational App</title>
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
				Reset your password
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Enter your email address and we'll send you a link to reset your password
			</p>
		</div>

		{#if submitted && !form?.error}
			<div class="bg-green-50 border border-green-200 rounded-md p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">
							Check your email
						</h3>
						<div class="mt-2 text-sm text-green-700">
							<p>
								If an account with that email address exists, we've sent you a password reset link. 
								Please check your email and follow the instructions to reset your password.
							</p>
						</div>
						<div class="mt-4">
							<a 
								href="/auth/signin" 
								class="text-sm font-medium text-green-800 hover:text-green-700"
							>
								Return to sign in →
							</a>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<form 
				class="mt-8 space-y-6" 
				method="POST"
				use:enhance={() => {
					loading = true
					return async ({ result, update }) => {
						loading = false
						if (result.type === 'success') {
							submitted = true
						}
						await update()
					}
				}}
			>
				{#if form?.error}
					<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
						{form.error}
					</div>
				{/if}

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
						placeholder="Enter your email address"
						disabled={loading}
					/>
				</div>

				<div>
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
							Sending reset link...
						{:else}
							Send password reset link
						{/if}
					</button>
				</div>

				<div class="text-center">
					<a 
						href="/auth/signin" 
						class="text-sm text-indigo-600 hover:text-indigo-500"
					>
						← Back to sign in
					</a>
				</div>
			</form>
		{/if}
	</div>
</div>