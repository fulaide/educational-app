<script>
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { t } from '@educational-app/i18n';
	import { Card, LocaleSwitcher } from '@educational-app/ui';
	
	// Make translations reactive to locale changes
	const teacherPortalTitle = $derived($t('teacher.home.teacher_portal'))
	const dashboardText = $derived($t('teacher.navigation.dashboard'))
	const signInText = $derived($t('teacher.navigation.signin'))
	const qrCodesText = $derived($t('teacher.navigation.qr_codes'))
	
</script>



<svelte:head>
	<title>{$t('teacher.home.title')} - {PUBLIC_APP_NAME || 'Lexi'}</title>
</svelte:head>

<div class="min-h-screen flex flex-col gap-6 items-center   bg-gradient-to-b from-blue-50 to-blue-100 p-4">

	<!-- Language Switcher -->
	<div class="w-full max-w-4xl">
		<LocaleSwitcher variant="dropdown" size="md" />
	</div>

	<!-- Header -->
	<Card variant="elevated" padding="lg" class="mb-6">
		<div class="flex items-center gap-4 p-6">
			<div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">👦</div>
			<div>
				<h2 class="text-xl font-bold font-family-comic text-primary">{teacherPortalTitle}</h2>
			</div>
		</div>
	</Card>


	<Card variant="elevated" padding="lg" class="mb-6">

		<div class="flex items-center gap-4 p-6">

			<a href="/dashboard" class="text-xl font-bold font-family-comic text-primary">{dashboardText}</a>
			<a href="/auth/signin" class="text-xl font-bold font-family-comic text-primary">{signInText}</a>
			<a href="/qr-codes" class="text-xl font-bold font-family-comic text-primary">{qrCodesText}</a>
		</div>
	</Card>

</div>