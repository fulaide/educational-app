<script lang="ts">
	import { t } from '@educational-app/i18n';
	import { 
		AuthPageContainer, 
		AuthHeader, 
		AuthForm, 
		AuthInput, 
		AuthButton, 
		AuthError, 
		AuthSuccess, 
		LocaleSwitcher 
	} from '@educational-app/ui';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let studentName = $state('');
	let grade = $state(1);
	let studentCount = $state(1);
	let loading = $state(false);

	// Make translations reactive
	const pageTitle = $derived($t('student.register.title'));
	const pageSubtitle = $derived($t('student.register.subtitle'));
	const studentNameLabel = $derived($t('student.register.name_label'));
	const studentNamePlaceholder = $derived($t('student.register.name_placeholder'));
	const gradeLabel = $derived($t('student.register.grade_label'));
	const countLabel = $derived($t('student.register.count_label'));
	const submitText = $derived($t('student.register.submit'));
	const submittingText = $derived($t('student.register.submitting'));
	const backToDashboard = $derived($t('student.register.back_to_dashboard'));
</script>

<svelte:head>
	<title>{pageTitle} - Lexi</title>
</svelte:head>

<AuthPageContainer>
	<LocaleSwitcher variant="buttons" size="sm" />

	<AuthHeader 
		title={pageTitle}
		subtitle={pageSubtitle}
	/>

	{#if form?.success}
		<AuthSuccess 
			title={$t('student.register.success_title')}
			message={$t('student.register.success_message', { count: form.createdCount })}
		>
			{#snippet actions()}
				<div class="flex gap-4">
					<a 
						href="/dashboard" 
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
					>
						{backToDashboard}
					</a>
					<a 
						href="/students/qr-codes" 
						class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
					>
						{$t('student.register.generate_qr_codes')}
					</a>
				</div>
			{/snippet}
		</AuthSuccess>
	{:else}
		<AuthForm 
			onSubmit={(isLoading) => loading = isLoading}
			onResult={async ({ result, update }) => {
				await update();
			}}
		>
			{#if form?.error}
				<AuthError error={form.error} />
			{/if}

			{#if studentCount === 1}
				<!-- Single student registration -->
				<AuthInput
					id="studentName"
					name="studentName"
					type="text"
					label={studentNameLabel}
					placeholder={studentNamePlaceholder}
					bind:value={studentName}
					required
					disabled={loading}
				/>
			{:else}
				<!-- Bulk student registration -->
				<div class="p-4 bg-blue-50 rounded-md">
					<p class="text-sm text-blue-700">
						{$t('student.register.bulk_info', { count: studentCount })}
					</p>
				</div>
			{/if}

			<AuthInput
				id="grade"
				name="grade"
				type="number"
				label={gradeLabel}
				bind:value={grade}
				min="1"
				max="12"
				required
				disabled={loading}
			/>

			<AuthInput
				id="studentCount"
				name="studentCount"
				type="number"
				label={countLabel}
				bind:value={studentCount}
				min="1"
				max="30"
				required
				disabled={loading}
			/>

			<AuthButton 
				{loading}
				loadingText={submittingText}
			>
				{submitText}
			</AuthButton>

			<div class="text-center">
				<a 
					href="/dashboard" 
					class="text-sm text-indigo-600 hover:text-indigo-500"
				>
					← {backToDashboard}
				</a>
			</div>
		</AuthForm>
	{/if}
</AuthPageContainer>