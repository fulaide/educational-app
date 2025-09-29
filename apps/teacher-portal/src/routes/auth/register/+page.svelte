<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let name = $state(form?.name || '')
	let email = $state(form?.email || '')
	let password = $state('')
	let confirmPassword = $state('')
	let loading = $state(false)
	let showPassword = $state(false)
	let showConfirmPassword = $state(false)

	const passwordsMatch = $derived(password && confirmPassword && password === confirmPassword)
	const passwordStrong = $derived(password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password))
	const canSubmit = $derived(name.trim() && email.trim() && passwordsMatch && passwordStrong && !loading)
</script>

<svelte:head>
	<title>Create Account - Educational App</title>
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
				Create your teacher account
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Join the educational platform
			</p>
		</div>

		{#if form?.success}
			<div class="bg-white rounded-lg shadow-lg p-8 text-center">
				<div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
					<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				
				<h3 class="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h3>
				<p class="text-gray-600 mb-4">{form.message}</p>
				
				<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
							</svg>
						</div>
						<div class="ml-3">
							<h4 class="text-sm font-medium text-blue-800">Next Steps:</h4>
							<ul class="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
								<li>Check your inbox for a verification email</li>
								<li>Don't forget to check your spam/junk folder</li>
								<li>Click the verification link to activate your account</li>
								<li>Once verified, you can sign in normally</li>
							</ul>
						</div>
					</div>
				</div>
				
				<div class="space-y-3">
					<a 
						href="/auth/signin" 
						class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-block"
					>
						Go to Sign In
					</a>
					<a 
						href="/auth/resend-verification?email={encodeURIComponent(form.email)}" 
						class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
					>
						Didn't receive email? Resend
					</a>
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
				<!-- Full Name -->
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700">
						Full Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						autocomplete="name"
						required
						bind:value={name}
						class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="Enter your full name"
						disabled={loading}
					/>
				</div>

				<!-- Email -->
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">
						Email Address
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

				<!-- Password -->
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">
						Password
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
							placeholder="Create a strong password"
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
					<div class="mt-1 text-xs text-gray-500 space-y-1">
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 rounded-full {password.length >= 8 ? 'bg-green-400' : 'bg-gray-300'}"></div>
							<span>At least 8 characters</span>
						</div>
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 rounded-full {/[A-Z]/.test(password) ? 'bg-green-400' : 'bg-gray-300'}"></div>
							<span>Uppercase letter</span>
						</div>
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 rounded-full {/[a-z]/.test(password) ? 'bg-green-400' : 'bg-gray-300'}"></div>
							<span>Lowercase letter</span>
						</div>
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 rounded-full {/\d/.test(password) ? 'bg-green-400' : 'bg-gray-300'}"></div>
							<span>Number</span>
						</div>
					</div>
				</div>

				<!-- Confirm Password -->
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
						Confirm Password
					</label>
					<div class="mt-1 relative">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							autocomplete="new-password"
							required
							bind:value={confirmPassword}
							class="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Confirm your password"
							disabled={loading}
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							on:click={() => showConfirmPassword = !showConfirmPassword}
						>
							{#if showConfirmPassword}
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
						Creating account...
					{:else}
						Create Account
					{/if}
				</button>
			</div>
		</form>

			<div class="text-center space-y-2">
				<a 
					href="/auth/signin" 
					class="text-sm text-indigo-600 hover:text-indigo-500"
				>
					Already have an account? Sign in
				</a>
			</div>
		{/if}
	</div>
</div>