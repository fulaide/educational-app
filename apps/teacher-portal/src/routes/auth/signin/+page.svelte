<script lang="ts">
	import { t } from '@educational-app/i18n';
	import {
		AuthButton,
		AuthError,
		AuthForm,
		AuthHeader,
		AuthInput,
		AuthLinks,
		AuthPageContainer,
		AuthPasswordInput,
		AuthSuccess,
		LocaleSwitcher
	} from '@educational-app/ui';
	import type { ActionData, PageData } from './$types';

	import { PUBLIC_APP_NAME } from '$env/static/public';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let email = $state('teacher@test.com') // Pre-fill for development
	let password = $state('password123') // Pre-fill for development  
	let loading = $state(false)

	

	// Make translations reactive to locale changes
	const pageTitle = $derived($t('auth.forms.signin.title'))
	const pageSubtitle = $derived($t('auth.forms.signin.subtitle'))
	const emailLabel = $derived($t('auth.forms.signin.email_label'))
	const emailPlaceholder = $derived($t('auth.forms.signin.email_placeholder'))
	const passwordLabel = $derived($t('auth.forms.signin.password_label'))
	const passwordPlaceholder = $derived($t('auth.forms.signin.password_placeholder'))
	const submitText = $derived($t('auth.forms.signin.submit'))
	const submittingText = $derived($t('auth.forms.signin.submitting'))
	const forgotPasswordText = $derived($t('auth.forms.signin.forgot_password'))
	const needAccountText = $derived($t('auth.forms.signin.need_account'))
	const createAccountText = $derived($t('auth.forms.signin.create_account'))
	
	// Debug logging
	console.log('Signin page loaded with callbackUrl:', data?.callbackUrl || 'no callback')
</script>

<svelte:head>
	<title>{$t('auth.forms.signin.title')} - {PUBLIC_APP_NAME}</title>
</svelte:head>

<AuthPageContainer>
	<LocaleSwitcher variant="buttons" size="sm" />

	<AuthHeader 
		title={pageTitle}
		subtitle={pageSubtitle}
	/>

	{#if data.passwordReset}
		<AuthSuccess message={$t('auth.messages.password_reset_success_text')} />
	{/if}

	<AuthForm 
		onSubmit={(isLoading) => loading = isLoading}
		onResult={async ({ result, update }) => {
			if (result.type === 'failure') {
				await update();
			} else if (result.type === 'redirect') {
				await update();
			}
		}}
	>
		{#if form?.error}
			<AuthError error={form.error}>
				{#if form?.needsVerification && form?.email}
					<a 
						href="/auth/resend-verification?email={encodeURIComponent(form.email)}" 
						class="font-medium text-red-700 hover:text-red-800 underline"
					>
						{$t('auth.messages.resend_verification')}
					</a>
				{/if}
			</AuthError>
		{/if}
		
		<input type="hidden" name="callbackUrl" value={data?.callbackUrl || '/dashboard'} />

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

		<AuthPasswordInput
			id="password"
			name="password"
			label={passwordLabel}
			placeholder={passwordPlaceholder}
			bind:value={password}
			required
			disabled={loading}
		/>

		<AuthLinks links={[
			{ 
				href: '/auth/forgot-password', 
				text: forgotPasswordText,
				align: 'left'
			}
		]} />

		<AuthButton 
			{loading}
			loadingText={submittingText}
		>
			{submitText}
		</AuthButton>

		<AuthLinks links={[
			{
				href: '/auth/register',
				text: createAccountText,
				prefix: needAccountText,
				align: 'center'
			}
		]} />
	</AuthForm>
</AuthPageContainer>