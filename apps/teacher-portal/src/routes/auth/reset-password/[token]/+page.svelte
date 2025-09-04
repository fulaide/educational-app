<script lang="ts">
	import { t } from '@educational-app/i18n'
	import type { PageData, ActionData } from './$types'
	import { 
		AuthPageContainer, 
		AuthHeader, 
		AuthForm, 
		AuthInput, 
		AuthPasswordInput, 
		AuthButton, 
		AuthError, 
		AuthLinks,
		LocaleSwitcher
	} from '@educational-app/ui'

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let password = $state('')
	let confirmPassword = $state('')
	let loading = $state(false)

	const passwordsMatch = $derived(password && confirmPassword && password === confirmPassword);
	const passwordStrong = $derived(password.length >= 8);
	const canSubmit = $derived(passwordsMatch && passwordStrong && !loading);

	// Make translations reactive to locale changes
	const pageTitle = $derived($t('auth.forms.reset_password.title'))
	const pageSubtitle = $derived($t('auth.forms.reset_password.subtitle'))
	const invalidTokenTitle = $derived($t('auth.forms.reset_password.invalid_token_title'))
	const tokenUsed = $derived($t('auth.forms.reset_password.token_used'))
	const tokenExpired = $derived($t('auth.forms.reset_password.token_expired'))
	const tokenInvalid = $derived($t('auth.forms.reset_password.token_invalid'))
	const tokenGeneric = $derived($t('auth.forms.reset_password.token_generic'))
	const requestNewLink = $derived($t('auth.forms.reset_password.request_new_link'))
	const passwordLabel = $derived($t('auth.forms.reset_password.password_label'))
	const passwordPlaceholder = $derived($t('auth.forms.reset_password.password_placeholder'))
	const confirmPasswordLabel = $derived($t('auth.forms.reset_password.confirm_password_label'))
	const confirmPasswordPlaceholder = $derived($t('auth.forms.reset_password.confirm_password_placeholder'))
	const passwordsNoMatch = $derived($t('auth.forms.reset_password.passwords_no_match'))
	const passwordsMatchText = $derived($t('auth.forms.reset_password.passwords_match'))
	const submitText = $derived($t('auth.forms.reset_password.submit'))
	const submittingText = $derived($t('auth.forms.reset_password.submitting'))
	const backToSigninText = $derived($t('auth.forms.reset_password.back_to_signin'))
</script>

<svelte:head>
	<title>{$t('auth.forms.reset_password.title')} - Educational App</title>
</svelte:head>

<AuthPageContainer>
	<LocaleSwitcher variant="buttons" size="sm" />

	<AuthHeader 
		title={pageTitle}
		subtitle={pageSubtitle}
	/>

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
						{invalidTokenTitle}
					</h3>
					<div class="mt-2 text-sm text-red-700">
						{#if data.debugInfo}
							{#if data.debugInfo.isUsed}
								<p>{tokenUsed}</p>
							{:else if data.debugInfo.isExpired}
								<p>{tokenExpired}</p>
							{:else}
								<p>{tokenInvalid}</p>
							{/if}
						{:else}
							<p>{tokenGeneric}</p>
						{/if}
					</div>
					<div class="mt-4">
						<a 
							href="/auth/forgot-password" 
							class="text-sm font-medium text-red-800 hover:text-red-700"
						>
							{requestNewLink}
						</a>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<AuthForm 
			onSubmit={(isLoading) => loading = isLoading}
			onResult={async ({ result, update }) => {
				await update()
			}}
		>
			{#if form?.error}
				<AuthError error={form.error} />
			{/if}

			<AuthPasswordInput
				id="password"
				name="password"
				label={passwordLabel}
				placeholder={passwordPlaceholder}
				bind:value={password}
				required
				disabled={loading}
				autocomplete="new-password"
				showStrength={true}
			/>

			<AuthInput
				id="confirmPassword"
				name="confirmPassword"
				type="password"
				label={confirmPasswordLabel}
				placeholder={confirmPasswordPlaceholder}
				bind:value={confirmPassword}
				required
				disabled={loading}
				autocomplete="new-password"
				error={confirmPassword && !passwordsMatch ? passwordsNoMatch : ''}
			/>
			{#if passwordsMatch}
				<p class="mt-1 text-sm text-green-600">{passwordsMatchText}</p>
			{/if}

			<AuthButton 
				{loading}
				loadingText={submittingText}
				disabled={!canSubmit}
			>
				{submitText}
			</AuthButton>
		</AuthForm>
	{/if}

	<AuthLinks links={[
		{
			href: '/auth/signin',
			text: backToSigninText,
			align: 'center'
		}
	]} />
</AuthPageContainer>