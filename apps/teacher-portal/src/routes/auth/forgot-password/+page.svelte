<script lang="ts">
	import { t } from '@educational-app/i18n'
	import type { ActionData } from './$types'
	import { 
		AuthPageContainer, 
		AuthHeader, 
		AuthForm, 
		AuthInput, 
		AuthButton, 
		AuthError, 
		AuthSuccess, 
		AuthLinks,
		LocaleSwitcher
	} from '@educational-app/ui'

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let email = $state('')
	let loading = $state(false)
	let submitted = $state(false)

	// Make translations reactive to locale changes
	const pageTitle = $derived($t('auth.forms.forgot_password.title'))
	const pageSubtitle = $derived($t('auth.forms.forgot_password.subtitle'))
	const emailLabel = $derived($t('auth.forms.forgot_password.email_label'))
	const emailPlaceholder = $derived($t('auth.forms.forgot_password.email_placeholder'))
	const submitText = $derived($t('auth.forms.forgot_password.submit'))
	const submittingText = $derived($t('auth.forms.forgot_password.submitting'))
	const backToSigninText = $derived($t('auth.forms.forgot_password.back_to_signin'))
	const successTitle = $derived($t('auth.forms.forgot_password.success_title'))
	const successMessage = $derived($t('auth.forms.forgot_password.success_message'))
	const returnToSigninText = $derived($t('auth.forms.forgot_password.return_to_signin'))
</script>

<svelte:head>
	<title>{pageTitle} - Educational App</title>
</svelte:head>

<AuthPageContainer>
	<LocaleSwitcher variant="buttons" size="sm" />

	<AuthHeader 
		title={pageTitle}
		subtitle={pageSubtitle}
	/>

	{#if submitted && !form?.error}
		<AuthSuccess 
			title={successTitle}
			message={successMessage}
		>
			{#snippet actions()}
				<AuthLinks links={[
					{
						href: '/auth/signin',
						text: returnToSigninText,
						align: 'left'
					}
				]} />
			{/snippet}
		</AuthSuccess>
	{:else}
		<AuthForm 
			onSubmit={(isLoading) => loading = isLoading}
			onResult={async ({ result, update }) => {
				if (result.type === 'success') {
					submitted = true
				}
				await update()
			}}
		>
			{#if form?.error}
				<AuthError error={form.error} />
			{/if}

			<AuthInput
				id="email"
				name="email"
				type="email"
				label={emailLabel}
				placeholder={emailPlaceholder}
				bind:value={email}
				required
				disabled={loading}
			/>

			<AuthButton 
				{loading}
				loadingText={submittingText}
			>
				{submitText}
			</AuthButton>

			<AuthLinks links={[
				{
					href: '/auth/signin',
					text: backToSigninText,
					align: 'center'
				}
			]} />
		</AuthForm>
	{/if}
</AuthPageContainer>