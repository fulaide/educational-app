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
	import { APP_NAME } from '$lib/constants';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let name = $state(form?.name || '');
	let email = $state(form?.email || '');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);

	// Make translations reactive - using parent-specific translations
	const pageTitle = $derived($t('parent.auth.register.title'));
	const pageSubtitle = $derived($t('parent.auth.register.subtitle'));
	const nameLabel = $derived($t('parent.auth.register.name_label'));
	const namePlaceholder = $derived($t('parent.auth.register.name_placeholder'));
	const emailLabel = $derived($t('parent.auth.register.email_label'));
	const emailPlaceholder = $derived($t('parent.auth.register.email_placeholder'));
	const passwordLabel = $derived($t('parent.auth.register.password_label'));
	const passwordPlaceholder = $derived($t('parent.auth.register.password_placeholder'));
	const confirmPasswordLabel = $derived($t('parent.auth.register.confirm_password_label'));
	const confirmPasswordPlaceholder = $derived($t('parent.auth.register.confirm_password_placeholder'));
	const submitText = $derived($t('parent.auth.register.submit'));
	const submittingText = $derived($t('parent.auth.register.submitting'));
	const alreadyHaveAccountText = $derived($t('parent.auth.register.already_have_account'));
	const signInText = $derived($t('parent.auth.register.sign_in'));
	const successTitle = $derived($t('parent.auth.register.success_title'));
	const successMessage = $derived($t('parent.auth.register.success_message'));
</script>

<svelte:head>
	<title>{pageTitle} - {APP_NAME}</title>
</svelte:head>

<AuthPageContainer>
	<LocaleSwitcher variant="buttons" size="sm" />

	<AuthHeader 
		title={pageTitle}
		subtitle={pageSubtitle}
	/>

	{#if form?.success}
		<AuthSuccess 
			title={successTitle}
			message={form?.message || successMessage}
		>
			{#snippet actions()}
				<div class="flex gap-4 justify-center">
					<a 
						href="/auth/signin"
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
					>
						{$t('auth.messages.go_to_signin')}
					</a>
					{#if form?.email}
						<a 
							href="/auth/resend-verification?email={encodeURIComponent(form.email)}"
							class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
						>
							{$t('auth.messages.resend_verification')}
						</a>
					{/if}
				</div>
			{/snippet}
		</AuthSuccess>
	{:else}
		<AuthForm 
			onSubmit={(isLoading) => {
				console.log('[CLIENT] Form submission started, loading:', isLoading);
				loading = isLoading;
			}}
			onResult={async ({ result, update }) => {
				console.log('[CLIENT] Form submission result:', result);
				await update();
			}}
		>
			{#if form?.error}
				<AuthError message={form.error} />
			{/if}

			<AuthInput
				id="name"
				name="name"
				type="text"
				label={nameLabel}
				placeholder={namePlaceholder}
				bind:value={name}
				required
				disabled={loading}
			/>

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

			<AuthPasswordInput
				id="confirmPassword"
				name="confirmPassword"
				label={confirmPasswordLabel}
				placeholder={confirmPasswordPlaceholder}
				bind:value={confirmPassword}
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
					text: signInText,
					prefix: alreadyHaveAccountText,
					align: 'center'
				}
			]} />
		</AuthForm>
	{/if}
</AuthPageContainer>