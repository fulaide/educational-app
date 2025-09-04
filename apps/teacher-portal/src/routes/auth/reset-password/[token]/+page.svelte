<script lang="ts">
	import { enhance } from '$app/forms'
	import type { PageData, ActionData } from './$types'

	export let data: PageData
	export let form: ActionData

	let password = ''
	let confirmPassword = ''
	let loading = false
	let showPassword = false

	$: passwordsMatch = password && confirmPassword && password === confirmPassword
	$: passwordStrong = password.length >= 8
	$: canSubmit = passwordsMatch && passwordStrong && !loading
</script>

<svelte:head>
	<title>Reset Password - Educational App</title>
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
				Set new password
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Enter your new password below
			</p>
		</div>

		{#if !data.validToken}
			<div class="bg-red-50 border border-red-200 rounded-md p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">
							Invalid or expired reset link
						</h3>
						<div class="mt-2 text-sm text-red-700">
							{#if data.debugInfo}
								{#if data.debugInfo.isUsed}
									<p>This password reset link has already been used. You can only use each reset link once.</p>
								{:else if data.debugInfo.isExpired}
									<p>This password reset link has expired (created {new Date(data.debugInfo.createdAt).toLocaleString()}). Reset links are valid for 1 hour.</p>
								{:else}
									<p>This password reset link is invalid.</p>
								{/if}
							{:else}
								<p>This password reset link is no longer valid. It may have expired or already been used.</p>
							{/if}
						</div>
						<div class="mt-4">
							<a 
								href="/auth/forgot-password" 
								class="text-sm font-medium text-red-800 hover:text-red-700"
							>
								Request a new reset link →
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
						await update()
					}
				}}
			>
				{#if form?.error}
					<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
						{form.error}
					</div>
				{/if}

					<div class="space-y-4">
						<div>
							<label for="password" class="block text-sm font-medium text-gray-700">
								New password
							</label>
							<div class="mt-1 relative">
								<input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									autocomplete="new-password"
									required
									bind:value={password}
									class="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									placeholder="Enter new password"
									disabled={loading}
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 pr-3 flex items-center"
									on:click={() => showPassword = !showPassword}
								>
									{#if showPassword}
										<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
										</svg>
									{:else}
										<svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									{/if}
								</button>
							</div>
							<p class="mt-1 text-sm text-gray-500">
								Must be at least 8 characters long
							</p>
						</div>

						<div>
							<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
								Confirm new password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autocomplete="new-password"
								required
								bind:value={confirmPassword}
								class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Confirm new password"
								disabled={loading}
							/>
							{#if confirmPassword && !passwordsMatch}
								<p class="mt-1 text-sm text-red-600">Passwords do not match</p>
							{:else if passwordsMatch}
								<p class="mt-1 text-sm text-green-600">Passwords match</p>
							{/if}
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={!canSubmit}
							class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
						>
							{#if loading}
								<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Updating password...
							{:else}
								Update password
							{/if}
						</button>
					</div>
			</form>
		{/if}

		<div class="text-center">
			<a 
				href="/auth/signin" 
				class="text-sm text-indigo-600 hover:text-indigo-500"
			>
				← Back to sign in
			</a>
		</div>
	</div>
</div>