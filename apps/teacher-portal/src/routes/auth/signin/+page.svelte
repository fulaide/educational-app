<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms'
	import { t, localeManager } from '@educational-app/i18n'
	import type { PageData, ActionData } from './$types'

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let email = $state('teacher@test.com') // Pre-fill for development
	let password = $state('password123') // Pre-fill for development  
	let loading = $state(false)
	let currentLocale = $state('de')
	let mounted = $state(false)

	onMount(() => {
		currentLocale = localeManager.getCurrentLocale()
		mounted = true
	})

	function switchLocale() {
		const newLocale = currentLocale === 'de' ? 'en' : 'de'
		localeManager.setLocale(newLocale)
		currentLocale = newLocale
	}
	
	// Debug logging
	console.log('Signin page loaded with callbackUrl:', data?.callbackUrl || 'no callback')
</script>

<svelte:head>
	<title>{$t('auth.forms.signin.title')} - Educational App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		{#if mounted}
			<div class="text-right mb-4">
				<button
					type="button"
					onclick={switchLocale}
					class="inline-flex items-center gap-2 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-500 font-medium bg-white rounded-md shadow-sm hover:shadow border border-indigo-200 hover:border-indigo-300"
				>
					<span class="w-5 h-3 rounded border border-gray-300 bg-gray-50 flex items-center justify-center text-xs font-medium">
						{currentLocale.toUpperCase()}
					</span>
					{currentLocale === 'de' ? 'English' : 'Deutsch'}
				</button>
			</div>
		{/if}
		
		<div>
			<div class="mx-auto h-12 w-12 text-indigo-600">
				<svg fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"/>
				</svg>
			</div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
				{$t('auth.forms.signin.title')}
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				{$t('auth.forms.signin.subtitle')}
			</p>
		</div>

		{#if data.passwordReset}
			<div class="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">
							{$t('auth.messages.password_reset_success_title')}
						</h3>
						<div class="mt-2 text-sm text-green-700">
							<p>{$t('auth.messages.password_reset_success_text')}</p>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<form 
			class="mt-8 space-y-6" 
			method="POST"
			use:enhance={() => {
				loading = true
				return async ({ result, update }) => {
					loading = false
					if (result.type === 'failure') {
						// Update form to show validation errors
						await update()
					} else if (result.type === 'redirect') {
						// Let SvelteKit handle the redirect
						await update()
					}
				}
			}}
		>
			{#if form?.error}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
					{form.error}
					{#if form?.needsVerification && form?.email}
						<div class="mt-2">
							<a 
								href="/auth/resend-verification?email={encodeURIComponent(form.email)}" 
								class="font-medium text-red-700 hover:text-red-800 underline"
							>
								{$t('auth.messages.resend_verification')}
							</a>
						</div>
					{/if}
				</div>
			{/if}
			
			<!-- Include callback URL as hidden input -->
			<input type="hidden" name="callbackUrl" value={data?.callbackUrl || '/dashboard'} />


			<div class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">
						{$t('auth.forms.signin.email_label')}
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						bind:value={email}
						class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={$t('auth.forms.signin.email_placeholder')}
						disabled={loading}
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">
						{$t('auth.forms.signin.password_label')}
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={password}
						class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder={$t('auth.forms.signin.password_placeholder')}
						disabled={loading}
					/>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div class="text-sm">
					<a href="/auth/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
						{$t('auth.forms.signin.forgot_password')}
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
					{$t('auth.forms.signin.submitting')}
				{:else}
					{$t('auth.forms.signin.submit')}
				{/if}
			</button>

			<p class="mt-4 text-center text-sm text-gray-600">
				{$t('auth.forms.signin.need_account')} <a href="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">{$t('auth.forms.signin.create_account')}</a>
			</p>
		</form>
	</div>
</div>